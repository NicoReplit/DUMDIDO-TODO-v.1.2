import { useState, useRef, useEffect } from 'react';
import './CelebrationMenu.css';
import Confetti from './Confetti';

function CelebrationMenu({ celebrationData, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
    setTimeout(() => {
      setClosing(false);
      if (onClose) onClose();
    }, 1500);
  };

  useEffect(() => {
    if (celebrationData) {
      setIsOpen(true);
      
      // Auto-close after 2.5 seconds
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, 2500);
      
      return () => clearTimeout(autoCloseTimer);
    }
  }, [celebrationData]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('celebration-settings-overlay')) {
      handleClose();
    }
  };

  const { basePoints, timeBonus, noPauseBonus, total } = celebrationData || {};

  return (
    <>
      {/* Confetti animation */}
      <Confetti isActive={isOpen} />
      
      {/* Background circle - scales independently */}
      <div 
        className={`celebration-circle-background ${isOpen ? 'active' : ''}`}
        style={{
          transform: isOpen ? 'translateX(-50%) scale(4.62) rotate(22deg)' : 'translateX(-50%) scale(0.8) rotate(22deg)',
        }}
      >
        <div className={`celebration-circle ${!isOpen ? 'wiggling' : ''}`}>
          <div 
            className="celebration-circle-eyes"
            style={{
              transform: isOpen ? 'translateX(-50%) scale(0.1732)' : 'translateX(-50%)',
              transition: 'transform 0.6s ease-out'
            }}
          >
            <div className="celebration-circle-eye"></div>
            <div className="celebration-circle-eye"></div>
          </div>
        </div>
      </div>

      {/* Settings content - positioned absolutely, no scaling */}
      {(isOpen || closing) && (
        <div 
          className="celebration-settings-overlay" 
          onClick={handleOverlayClick}
        >
          <div className="celebration-settings-content">
            <div className={`celebration-info-pill ${closing ? 'info-pill-1-close' : 'info-pill-1'}`}>
              <span className="celebration-label">Base Points:</span>
              <span className="celebration-value">{basePoints}</span>
            </div>

            <div className={`celebration-info-pill ${closing ? 'info-pill-2-close' : 'info-pill-2'}`}>
              <span className="celebration-label">Time Bonus:</span>
              <span className="celebration-value">{timeBonus >= 0 ? '+' : ''}{timeBonus}</span>
            </div>

            {noPauseBonus > 0 && (
              <div className={`celebration-info-pill ${closing ? 'info-pill-3-close' : 'info-pill-3'}`}>
                <span className="celebration-label">No-Pause Bonus:</span>
                <span className="celebration-value">+{noPauseBonus}</span>
              </div>
            )}

            <div className={`celebration-total-pill ${closing ? 'total-pill-close' : 'total-pill'}`}>
              <span className="celebration-label">Total:</span>
              <span className="celebration-value celebration-total-value">{total}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CelebrationMenu;
