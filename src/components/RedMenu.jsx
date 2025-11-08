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
      className="red-menu" 
      style={{
        transform: `translateX(-50%) scale(${scale})`,
        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
    >
    </div>
  );
}

export default RedMenu;
