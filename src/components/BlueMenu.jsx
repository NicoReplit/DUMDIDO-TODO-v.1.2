import { useState, useRef, useEffect } from 'react';
import './BlueMenu.css';

function BlueMenu({ globalPin, onSavePin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [dynamicScale, setDynamicScale] = useState(3.85);
  const touchStartX = useRef(null);
  const swipeThreshold = 50;

  // Calculate dynamic scale to reach name pills bottom border (195px)
  useEffect(() => {
    const calculateScale = () => {
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      const circleRadius = (24 * vmin) / 100; // 48vmin diameter / 2
      const circleBottomY = window.innerHeight + 90; // bottom: -90px
      const circleCenterY = circleBottomY - circleRadius; // Subtract radius to get center (Y increases downward)
      const targetTopEdge = 250; // Target position from top
      
      // Scale needed so top edge reaches target: centerY - (radius * scale) = targetTop
      const scale = (circleCenterY - targetTopEdge) / circleRadius;
      setDynamicScale(Math.max(1, scale)); // Minimum scale of 1
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const handleTouchStart = (e) => {
    if (isOpen) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (isOpen || touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;

    if (Math.abs(deltaX) > swipeThreshold && deltaX > 0) {
      // Swipe right to open
      setIsOpen(true);
    }

    touchStartX.current = null;
  };

  const handleSave = async () => {
    if (globalPin && !currentPin) {
      alert('Please enter your current PIN');
      return;
    }

    if (pin && pin !== confirmPin) {
      alert('PINs do not match');
      return;
    }

    if (pin && pin.length !== 4) {
      alert('PIN must be 4 digits');
      return;
    }

    await onSavePin(pin, currentPin);
    handleClose();
  };

  const handleRemovePin = async () => {
    if (!currentPin || currentPin.length !== 4) {
      alert('Please enter your current PIN to remove it');
      return;
    }
    if (confirm('Are you sure you want to remove the global PIN?')) {
      await onSavePin(null, currentPin);
      handleClose();
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
    setTimeout(() => {
      setClosing(false);
      setPin('');
      setConfirmPin('');
      setCurrentPin('');
    }, 1500);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('blue-settings-overlay')) {
      handleClose();
    }
  };

  const handleOverlayTouchStart = (e) => {
    if (!isOpen) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleOverlayTouchEnd = (e) => {
    if (!isOpen || touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;

    if (Math.abs(deltaX) > swipeThreshold && deltaX < 0) {
      // Swipe left to close
      handleClose();
    }

    touchStartX.current = null;
  };

  return (
    <>
      {/* Background circle - scales dynamically to reach name pills bottom border */}
      <div 
        className={`blue-circle-background ${isOpen ? 'active' : ''}`}
        style={{
          transform: isOpen ? `scale(${dynamicScale})` : 'scale(1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <div className={`blue-circle ${!isOpen ? 'wiggling' : ''}`}>
          <div 
            className="blue-circle-eyes" 
            style={{ 
              transform: isOpen ? `translateX(calc(-50% + 30px)) scale(${1 / dynamicScale})` : 'translateX(calc(-50% + 30px))',
              transition: 'transform 1.2s ease-out',
              animationPlayState: !isOpen ? 'running' : 'paused'
            }}
          >
            <div className="blue-circle-eye"></div>
            <div className="blue-circle-eye"></div>
          </div>
        </div>
      </div>

      {/* Settings content - positioned absolutely, no scaling */}
      {(isOpen || closing) && (
        <div 
          className="blue-settings-overlay" 
          onClick={handleOverlayClick}
          onTouchStart={handleOverlayTouchStart}
          onTouchEnd={handleOverlayTouchEnd}
        >
          <div className="blue-settings-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="blue-settings-title">PIN Settings</h2>
            {globalPin && (
              <input
                type="password"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Current PIN"
                maxLength="4"
                pattern="[0-9]*"
                inputMode="numeric"
                className={`blue-pin-input ${closing ? 'pin-input-1-close' : 'pin-input-1'}`}
              />
            )}

            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder={globalPin ? 'New PIN' : 'PIN (4 digits)'}
              maxLength="4"
              pattern="[0-9]*"
              inputMode="numeric"
              className={`blue-pin-input ${closing ? (globalPin ? 'pin-input-2-close' : 'pin-input-1-close') : (globalPin ? 'pin-input-2' : 'pin-input-1')}`}
            />

            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Repeat PIN"
              maxLength="4"
              pattern="[0-9]*"
              inputMode="numeric"
              className={`blue-pin-input ${closing ? (globalPin ? 'pin-input-3-close' : 'pin-input-2-close') : (globalPin ? 'pin-input-3' : 'pin-input-2')}`}
            />

            <div className="blue-button-group">
              {globalPin && (
                <button onClick={handleRemovePin} className={`blue-remove-button ${closing ? 'button-animate-4-close' : 'button-animate-4'}`}>
                  Remove PIN
                </button>
              )}
              <button onClick={handleSave} className={`blue-save-button ${closing ? (globalPin ? 'button-animate-5-close' : 'button-animate-3-close') : (globalPin ? 'button-animate-5' : 'button-animate-3')}`}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BlueMenu;
