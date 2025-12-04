import { useState, useEffect } from 'react';
import './CustomNotification.css';

function CustomNotification({ message, type = 'success', onClose, onConfirm, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);
  const isConfirm = type === 'confirm';

  useEffect(() => {
    if (!isConfirm) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, isConfirm]);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onConfirm) onConfirm();
      onClose();
    }, 300);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`custom-notification ${type} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {type === 'success' && '⭐'}
          {type === 'error' && '❌'}
          {type === 'info' && 'ℹ️'}
          {type === 'confirm' && '⭐'}
        </div>
        <div className="notification-message">
          {message.split('\n').map((line, i) => (
            <span key={i}>{line}{i < message.split('\n').length - 1 && <br />}</span>
          ))}
        </div>
      </div>
      {isConfirm ? (
        <div className="notification-buttons">
          <button className="notification-btn confirm-btn" onClick={handleConfirm}>
            Ja
          </button>
          <button className="notification-btn cancel-btn" onClick={handleCancel}>
            Nein
          </button>
        </div>
      ) : (
        <button className="notification-close" onClick={handleCancel}>
          ✕
        </button>
      )}
    </div>
  );
}

export default CustomNotification;
