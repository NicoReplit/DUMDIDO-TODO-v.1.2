import { useState, useEffect } from 'react';
import './CustomNotification.css';

function CustomNotification({ message, type = 'success', onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`custom-notification ${type} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {type === 'success' && '⭐'}
          {type === 'error' && '❌'}
          {type === 'info' && 'ℹ️'}
        </div>
        <div className="notification-message">{message}</div>
      </div>
      <button className="notification-close" onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}>
        ✕
      </button>
    </div>
  );
}

export default CustomNotification;
