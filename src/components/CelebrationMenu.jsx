import { useState, useRef, useEffect } from 'react';
import './CelebrationMenu.css';
import Confetti from './Confetti';

function CelebrationMenu({ celebrationData, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [moonRx, setMoonRx] = useState(80);
  const [moonRy, setMoonRy] = useState(48);
  const [dynamicScale, setDynamicScale] = useState(4.62);

  // Calculate dynamic scale to reach name pills bottom border (195px)
  useEffect(() => {
    const calculateScale = () => {
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      const circleRadius = (24 * vmin) / 100; // 48vmin diameter / 2
      const circleBottomOffset = (-33.6 * vmin) / 100 + 50; // bottom: calc(-33.6vmin + 50px)
      const circleBottomY = window.innerHeight - circleBottomOffset;
      const circleCenterY = circleBottomY - circleRadius; // Subtract radius to get center (Y increases downward)
      const targetTopEdge = 155; // 40px above name pills bottom border
      
      // Scale needed so top edge reaches target: centerY - (radius * scale) = targetTop
      const scale = (circleCenterY - targetTopEdge) / circleRadius;
      setDynamicScale(Math.max(0.8, scale)); // Minimum scale of 0.8 (default starting scale)
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

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

  // Moon animation synchronized with blue circle scaling (with 0.5s delay)
  useEffect(() => {
    if (isOpen && !closing) {
      // Forward animation - reveal moon during scale-up (0.6s), delayed by 0.5s
      setMoonRx(80);
      setMoonRy(48);
      
      // Delay animation start by 0.5 seconds
      setTimeout(() => {
        const startTime = performance.now();
        const scaleDuration = 600; // 0.6s to match blue circle scale animation
        
        // Easing function (ease-out to match blue circle)
        const easeOut = (t) => {
          return 1 - Math.pow(1 - t, 3);
        };
        
        const animateForward = (currentTime) => {
          const elapsed = currentTime - startTime;
          
          if (elapsed < scaleDuration) {
            const progress = easeOut(elapsed / scaleDuration);
            setMoonRx(80 - (80 - 28) * progress);
            setMoonRy(48 - (48 - 40) * progress);
            requestAnimationFrame(animateForward);
          } else {
            setMoonRx(28);
            setMoonRy(40);
          }
        };
        
        requestAnimationFrame(animateForward);
      }, 500);
    } else if (!isOpen && closing) {
      // Reverse animation - hide moon during scale-down (0.6s)
      // This triggers when isOpen becomes false (same time as blue circle scale-down)
      const startTime = performance.now();
      const scaleDuration = 600; // 0.6s to match blue circle scale animation
      
      const easeOut = (t) => {
        return 1 - Math.pow(1 - t, 3);
      };
      
      const animateReverse = (currentTime) => {
        const elapsed = currentTime - startTime;
        
        if (elapsed < scaleDuration) {
          const progress = easeOut(elapsed / scaleDuration);
          setMoonRx(28 + (80 - 28) * progress);
          setMoonRy(40 + (48 - 40) * progress);
          requestAnimationFrame(animateReverse);
        } else {
          setMoonRx(80);
          setMoonRy(48);
        }
      };
      
      requestAnimationFrame(animateReverse);
    }
  }, [isOpen, closing]);

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
      
      {/* Background circle - scales dynamically to reach name pills bottom border */}
      <div 
        className={`celebration-circle-background ${isOpen ? 'active' : ''}`}
        style={{
          transform: isOpen ? `translateX(-50%) scale(${dynamicScale}) rotate(22deg)` : 'translateX(-50%) scale(0.8) rotate(22deg)',
        }}
      >
        <div className={`celebration-circle ${!isOpen ? 'wiggling' : ''}`}>
          <div 
            className="celebration-circle-eyes"
            style={{
              transform: isOpen ? `translate(-50%, -20px) scale(${1 / dynamicScale})` : 'translateX(-50%)',
              transition: 'transform 0.6s ease-out'
            }}
          >
            <div className="celebration-circle-eye"></div>
            <div className="celebration-circle-eye"></div>
            
            {/* Half-moon positioned under eyes */}
            <svg 
              className="celebration-half-moon" 
              width="200" 
              height="200" 
              viewBox="0 0 130 100" 
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: isOpen ? 'translateX(-50%) rotate(-90deg) scale(1.3)' : 'translateX(-50%) rotate(-90deg) scale(0.7)',
                transition: 'transform 0.6s ease-out'
              }}
            >
              <defs>
                <mask id="celebrationMoonMask">
                  <circle cx="50" cy="50" r="40" fill="white"/>
                </mask>
              </defs>
              <circle cx="50" cy="50" r="40" fill="black"/>
              <circle cx="10" cy="50" r="30" fill="#EE4100" mask="url(#celebrationMoonMask)"/>
              <ellipse className="moon-reveal" cx="80" cy="50" rx={moonRx} ry={moonRy} fill="#0061ee" />
            </svg>
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
