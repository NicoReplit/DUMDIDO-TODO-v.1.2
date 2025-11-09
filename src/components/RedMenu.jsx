import { useState, useRef } from 'react';
import './RedMenu.css';

function RedMenu({ globalPin, onSavePin }) {
  const [scale, setScale] = useState(1);
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
        setScale(3.85);
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
    setScale(1);
    setPin('');
    setConfirmPin('');
    setCurrentPin('');
  };

  return (
    <div 
      className="red-menu-wrapper"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 'calc(-33.6vmin + 30px)',
        transform: `translateX(calc(-50% - 10px)) scale(${scale})`,
        transition: 'transform 1.2s ease-out',
        transformOrigin: 'center 70%',
        '--menu-scale': scale
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`red-menu-inner ${scale === 1 ? 'wiggling' : ''}`}>
        <div 
          className="red-menu-eyes" 
          style={{ 
            transform: `translateX(-50%) scale(${1 / scale})`,
            transition: 'transform 1.2s ease-out',
            animationPlayState: scale === 1 ? 'running' : 'paused'
          }}
        >
          <div className="red-menu-eye"></div>
          <div className="red-menu-eye"></div>
        </div>

        {scale === 3.85 && (
          <div 
            className="red-menu-settings"
            style={{
              transform: `translate(-50%, -50%) scale(${1 / scale})`,
              transition: 'opacity 0.3s ease-out',
              opacity: 1
            }}
          >
            <h3 style={{ margin: '0 0 20px 0', color: 'white' }}>🔒 PIN Settings</h3>

            {globalPin && (
              <div className="settings-field">
                <input
                  type="password"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Current PIN"
                  maxLength="4"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  style={{ width: '100%', padding: '10px', fontSize: '18px', marginBottom: '10px' }}
                />
              </div>
            )}

            <div className="settings-field">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder={globalPin ? 'New PIN' : 'PIN (4 digits)'}
                maxLength="4"
                pattern="[0-9]*"
                inputMode="numeric"
                style={{ width: '100%', padding: '10px', fontSize: '18px', marginBottom: '10px' }}
              />
            </div>

            {pin && (
              <div className="settings-field">
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Repeat PIN"
                  maxLength="4"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  style={{ width: '100%', padding: '10px', fontSize: '18px', marginBottom: '10px' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {globalPin && (
                <button onClick={handleRemovePin} style={{ flex: 1, padding: '12px', fontSize: '16px', backgroundColor: '#FF006E', color: 'white', border: 'none', borderRadius: '8px' }}>
                  Remove
                </button>
              )}
              <button onClick={handleClose} style={{ flex: 1, padding: '12px', fontSize: '16px', backgroundColor: '#707070', color: 'white', border: 'none', borderRadius: '8px' }}>
                Cancel
              </button>
              <button onClick={handleSave} style={{ flex: 1, padding: '12px', fontSize: '16px', backgroundColor: '#38D247', color: 'white', border: 'none', borderRadius: '8px' }}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RedMenu;
