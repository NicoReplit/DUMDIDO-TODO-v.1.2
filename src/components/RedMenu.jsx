import { useState, useRef } from 'react';
import './RedMenu.css';

function RedMenu({ globalPin, onSavePin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const touchStartY = useRef(null);
  const swipeThreshold = 50;

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;

    if (Math.abs(deltaY) > swipeThreshold) {
      if (deltaY > 0) {
        setIsOpen(true);
      } else {
        handleClose();
      }
    }

    touchStartY.current = null;
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

  return (
    <>
      {/* Background circle - scales independently */}
      <div 
        className="red-circle-background"
        style={{
          transform: isOpen ? 'scale(3.85)' : 'scale(1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`red-circle ${!isOpen ? 'wiggling' : ''}`}>
          <div 
            className="red-circle-eyes" 
            style={{ 
              animationPlayState: !isOpen ? 'running' : 'paused'
            }}
          >
            <div className="red-circle-eye"></div>
            <div className="red-circle-eye"></div>
          </div>
        </div>
      </div>

      {/* Settings content - positioned absolutely, no scaling */}
      {(isOpen || closing) && (
        <div className="red-settings-overlay">
          <div className="red-settings-content">
            {globalPin && (
              <input
                type="password"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Current PIN"
                maxLength="4"
                pattern="[0-9]*"
                inputMode="numeric"
                className={`red-pin-input ${closing ? 'pin-input-1-close' : 'pin-input-1'}`}
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
              className={`red-pin-input ${closing ? (globalPin ? 'pin-input-2-close' : 'pin-input-1-close') : (globalPin ? 'pin-input-2' : 'pin-input-1')}`}
            />

            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Repeat PIN"
              maxLength="4"
              pattern="[0-9]*"
              inputMode="numeric"
              className={`red-pin-input ${closing ? (globalPin ? 'pin-input-3-close' : 'pin-input-2-close') : (globalPin ? 'pin-input-3' : 'pin-input-2')}`}
            />

            <div className="red-button-group">
              <button onClick={handleSave} className={`red-save-button ${closing ? 'button-animate-3-close' : 'button-animate-3'}`}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RedMenu;
