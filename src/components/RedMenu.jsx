import { useState, useRef } from 'react';
import './RedMenu.css';

function RedMenu({ onClick }) {
  const [scale, setScale] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartY = useRef(null);
  const touchStartScale = useRef(1);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartScale.current = scale;
    setIsTransitioning(false);
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return;

    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY;
    
    const maxScale = 3.85;
    const maxSwipeDistance = window.innerHeight * 0.7;
    const scaleFactor = (deltaY / maxSwipeDistance) * (maxScale - 1);
    
    const newScale = Math.min(maxScale, Math.max(1, touchStartScale.current + scaleFactor));
    setScale(newScale);
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
    
    if (scale < 1.1) {
      setIsTransitioning(true);
      setScale(1);
      setTimeout(() => setIsTransitioning(false), 400);
    } else {
      setIsTransitioning(false);
    }
  };

  return (
    <div 
      className="red-menu" 
      style={{
        transform: `translateX(-50%) scale(${scale})`,
        transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
    >
    </div>
  );
}

export default RedMenu;
