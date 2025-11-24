import React, { useState, useEffect, useRef } from 'react';
import './QuarterCircle.css';

function QuarterCircle({ onClick, isMenuOpen }) {
  const [dynamicScale, setDynamicScale] = useState(1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const calculateScale = () => {
      if (!wrapperRef.current) return;
      
      const rect = wrapperRef.current.getBoundingClientRect();
      const originY = rect.top + 30;
      const originToTop = 30;
      
      const header = document.querySelector('.dumbledido-header');
      const targetTop = header ? header.getBoundingClientRect().bottom : 195;
      
      const scale = (originY - targetTop) / originToTop;
      const finalScale = Math.max(1, scale * 2);
      console.log('Quarter Circle Scale:', finalScale);
      setDynamicScale(finalScale);
    };

    if (isMenuOpen) {
      const timer = setTimeout(calculateScale, 50);
      window.addEventListener('resize', calculateScale);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', calculateScale);
      };
    }
  }, [isMenuOpen]);

  return (
    <div 
      ref={wrapperRef}
      className={`quarter-circle-wrapper ${isMenuOpen ? 'menu-open' : ''}`}
      onClick={onClick}
      style={{
        transform: isMenuOpen ? `scale(${dynamicScale})` : 'scale(1)',
      }}
    >
      <svg 
        className="quarter-circle-svg" 
        width="60" 
        height="60" 
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
      >
        <circle
          cx="600"
          cy="600"
          r="600"
          fill="#0061EE"
        />
      </svg>
      <svg 
        className="quarter-circle-cross" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
        style={{
          transform: isMenuOpen ? `scale(${1 / dynamicScale})` : 'scale(1)',
          transition: 'transform 0.6s ease-out'
        }}
      >
        <line 
          x1="4" 
          y1="4" 
          x2="20" 
          y2="20" 
          stroke="#FFFFFF" 
          strokeWidth="8" 
          strokeLinecap="round"
        />
        <line 
          x1="20" 
          y1="4" 
          x2="4" 
          y2="20" 
          stroke="#FFFFFF" 
          strokeWidth="8" 
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default QuarterCircle;
