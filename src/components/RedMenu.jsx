import { useState, useRef } from 'react';
import './RedMenu.css';

function RedMenu({ onClick }) {
  const [scale, setScale] = useState(1);
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
        setScale(1);
      }
    }

    touchStartY.current = null;
  };

  return (
    <div 
      className="red-menu-wrapper"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 'calc(-33.6vmin + 30px)',
        transform: `translateX(-50%) scale(${scale})`,
        transition: 'transform 1.2s ease-out',
        transformOrigin: 'center 70%',
        '--menu-scale': scale
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
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
      </div>
    </div>
  );
}

export default RedMenu;
