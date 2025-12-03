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

  // Calculate dynamic scale to reach the blue line (header bottom border)
  useEffect(() => {
    const calculateScale = () => {
      const appContainer = document.querySelector('.dumbledido-app');
      const deviceScreen = document.querySelector('.device-screen') || document.querySelector('.device-screen-fullscreen');
      
      const containerHeight = appContainer?.offsetHeight || 1280;
      const deviceVmin = deviceScreen ? 
        Math.min(deviceScreen.offsetWidth, deviceScreen.offsetHeight) : 
        Math.min(window.innerWidth, window.innerHeight);
      
      const circleRadius = 0.24 * deviceVmin;
      const circleBottomOffset = -0.42 * deviceVmin + 30;
      const circleBottomY = containerHeight - circleBottomOffset;
      const circleCenterY = circleBottomY - circleRadius;
      
      const header = document.querySelector('.dumbledido-header');
      const appRect = appContainer?.getBoundingClientRect() || { top: 0 };
      const headerRect = header?.getBoundingClientRect() || { bottom: 195 };
      const targetTopEdge = headerRect.bottom - appRect.top;
      
      const scale = (circleCenterY - targetTopEdge) / circleRadius;
      const reducedScale = scale * 0.8;
      setDynamicScale(Math.max(1, reducedScale));
    };

    setTimeout(calculateScale, 100);
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
