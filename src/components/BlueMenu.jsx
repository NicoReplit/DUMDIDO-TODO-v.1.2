import { useState, useRef } from 'react';
import './BlueMenu.css';

function BlueMenu({ globalPin, onSavePin }) {
  const [scale, setScale] = useState(1);
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
        setScale(3.85);
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
      setScale(1);
    }, 500);
    setTimeout(() => {
      setClosing(false);
      setPin('');
      setConfirmPin('');
      setCurrentPin('');
    }, 1500);
  };

  return (
    <div 
      className="blue-menu-wrapper"
      style={{
        position: 'fixed',
        left: 'calc(-33.6vmin + 30px)',
        top: '50%',
        transform: `translateY(calc(-50% - 10px)) scale(${scale})`,
        transition: 'transform 1.2s ease-out',
        transformOrigin: '70% center',
        '--menu-scale': scale
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`blue-menu-inner ${scale === 1 ? 'wiggling' : ''}`}>
        <div 
          className="blue-menu-eyes" 
          style={{ 
            transform: `translateX(-50%) scale(${1 / scale})`,
            transition: 'transform 1.2s ease-out',
            animationPlayState: scale === 1 ? 'running' : 'paused'
          }}
        >
          <div className="blue-menu-eye"></div>
          <div className="blue-menu-eye"></div>
        </div>

        {(scale === 3.85 || closing) && (
          <div 
            className="blue-menu-settings"
            style={{
              top: '20px',
              transform: `translate(-50%, 0) scale(${1 / scale})`,
            }}
          >
            {globalPin && (
              <input
                type="password"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Current PIN"
                maxLength="4"
                pattern="[0-9]*"
                inputMode="numeric"
                className={`blue-pin-input ${closing ? 'blue-pin-input-1-close' : 'blue-pin-input-1'}`}
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
              className={`blue-pin-input ${closing ? (globalPin ? 'blue-pin-input-2-close' : 'blue-pin-input-1-close') : (globalPin ? 'blue-pin-input-2' : 'blue-pin-input-1')}`}
            />

            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Repeat PIN"
              maxLength="4"
              pattern="[0-9]*"
              inputMode="numeric"
              className={`blue-pin-input ${closing ? (globalPin ? 'blue-pin-input-3-close' : 'blue-pin-input-2-close') : (globalPin ? 'blue-pin-input-3' : 'blue-pin-input-2')}`}
            />

            <div className="blue-button-group">
              <button onClick={handleSave} className={`blue-save-button ${closing ? 'blue-button-animate-3-close' : 'blue-button-animate-3'}`}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlueMenu;
