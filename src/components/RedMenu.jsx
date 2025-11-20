import { useState, useRef, useEffect } from 'react';
import PINChangeModal from './PINChangeModal';
import MaxPointsModal from './MaxPointsModal';
import './RedMenu.css';

function RedMenu({ globalPin, onSavePin, onAddUser, maxPoints, onSaveMaxPoints }) {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showPINModal, setShowPINModal] = useState(false);
  const [showMaxPointsModal, setShowMaxPointsModal] = useState(false);
  const [dynamicScale, setDynamicScale] = useState(3.85);
  const touchStartY = useRef(null);
  const swipeThreshold = 50;

  // Calculate dynamic scale to reach name pills bottom border (195px)
  useEffect(() => {
    const calculateScale = () => {
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      const circleRadius = (24 * vmin) / 100; // 48vmin diameter / 2
      const circleBottomOffset = (-33.6 * vmin) / 100 + 30; // bottom: calc(-33.6vmin + 30px)
      const circleBottomY = window.innerHeight - circleBottomOffset;
      const circleCenterY = circleBottomY - circleRadius; // Subtract radius to get center (Y increases downward)
      const targetTopEdge = 195; // Bottom border of name pills
      
      // Scale needed so top edge reaches target: centerY - (radius * scale) = targetTop
      const scale = (circleCenterY - targetTopEdge) / circleRadius;
      setDynamicScale(Math.max(1, scale)); // Minimum scale of 1
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // Block scrolling when menu is open or closing
  useEffect(() => {
    if (isOpen || closing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, closing]);

  const handleTouchStart = (e) => {
    if (isOpen) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isOpen || touchStartY.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;

    if (Math.abs(deltaY) > swipeThreshold && deltaY > 0) {
      // Swipe up to open
      setIsOpen(true);
    }

    touchStartY.current = null;
  };


  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
    setTimeout(() => {
      setClosing(false);
    }, 1500);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('red-settings-overlay')) {
      handleClose();
    }
  };

  const handleOverlayTouchStart = (e) => {
    if (!isOpen) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleOverlayTouchEnd = (e) => {
    if (!isOpen || touchStartY.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;

    if (Math.abs(deltaY) > swipeThreshold && deltaY < 0) {
      // Swipe down to close
      handleClose();
    }

    touchStartY.current = null;
  };

  return (
    <>
      {/* Background circle - scales dynamically to reach name pills bottom border */}
      <div 
        className="red-circle-background"
        style={{
          transform: isOpen ? `translateX(calc(-50% - 10px)) scale(${dynamicScale})` : 'translateX(calc(-50% - 10px)) scale(1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <div className={`red-circle ${!isOpen ? 'wiggling' : ''}`}>
          <div 
            className="red-circle-eyes" 
            style={{ 
              transform: isOpen ? `translateX(-50%) scale(${1 / dynamicScale})` : 'translateX(-50%)',
              transition: 'transform 1.2s ease-out',
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
        <div 
          className="red-settings-overlay" 
          onClick={handleOverlayClick}
          onTouchStart={handleOverlayTouchStart}
          onTouchEnd={handleOverlayTouchEnd}
        >
          <div className="red-settings-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="red-settings-title">Settings</h2>
            <button 
              onClick={() => {
                handleClose();
                setTimeout(() => onAddUser(), 600);
              }} 
              className={`red-menu-button ${closing ? 'button-animate-1-close' : 'button-animate-1'}`}
            >
              Neuer Benutzer
            </button>

            <button 
              onClick={() => {
                handleClose();
                setTimeout(() => setShowPINModal(true), 600);
              }} 
              className={`red-menu-button ${closing ? 'button-animate-2-close' : 'button-animate-2'}`}
            >
              PIN ändern
            </button>

            <button 
              onClick={() => {
                handleClose();
                setTimeout(() => setShowMaxPointsModal(true), 600);
              }} 
              className={`red-menu-button ${closing ? 'button-animate-3-close' : 'button-animate-3'}`}
            >
              Max Punkte
            </button>
          </div>
        </div>
      )}

      {showPINModal && (
        <PINChangeModal
          globalPin={globalPin}
          onSave={onSavePin}
          onClose={() => setShowPINModal(false)}
        />
      )}

      {showMaxPointsModal && (
        <MaxPointsModal
          globalPin={globalPin}
          currentMaxPoints={maxPoints}
          onSave={onSaveMaxPoints}
          onClose={() => setShowMaxPointsModal(false)}
        />
      )}
    </>
  );
}

export default RedMenu;
