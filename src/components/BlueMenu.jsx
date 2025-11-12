import { useState, useRef } from 'react';
import './BlueMenu.css';

function BlueMenu({ globalPin, onSavePin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const touchStartX = useRef(null);
  const swipeThreshold = 50;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        setIsOpen(true);
      } else {
        handleClose();
      }
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

  return (
    <>
      {/* Background circle - scales independently */}
      <div 
        className="blue-circle-background"
        style={{
          transform: isOpen ? 'scale(3.85)' : 'scale(1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`blue-circle ${!isOpen ? 'wiggling' : ''}`}>
          <div 
            className="blue-circle-eyes" 
            style={{ 
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
        <div className="blue-settings-overlay">
          <div className="blue-settings-content">
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
              <button onClick={handleSave} className={`blue-save-button ${closing ? 'button-animate-3-close' : 'button-animate-3'}`}>
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
