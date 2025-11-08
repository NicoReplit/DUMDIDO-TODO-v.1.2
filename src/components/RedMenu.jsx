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
      className={`red-menu ${scale === 1 ? 'wiggling' : ''}`}
      style={{
        transform: `translateX(-50%) scale(${scale})`,
        transition: scale === 1 ? 'none' : 'transform 0.8s ease-in',
        '--menu-scale': scale
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
    >
      <div 
        className="red-menu-eyes" 
        style={{ 
          transform: `translateX(-50%) scale(${1 / scale})`,
          animationPlayState: scale === 1 ? 'running' : 'paused'
        }}
      >
        <div className="red-menu-eye"></div>
        <div className="red-menu-eye"></div>
      </div>
    </div>
  );
}

export default RedMenu;
