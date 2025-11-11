import { useState, useEffect, useRef } from 'react';
import './BlueCircle.css';

function BlueCircle({ celebrationTick, points }) {
  const [scale, setScale] = useState(1);
  const [showPoints, setShowPoints] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (celebrationTick > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setScale(7.56);
      setShowPoints(true);
      
      timeoutRef.current = setTimeout(() => {
        setScale(1);
        setShowPoints(false);
        timeoutRef.current = null;
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [celebrationTick]);

  return (
    <div 
      className="blue-circle-wrapper"
      style={{
        transform: `translate(-20%, 20%) rotate(${scale === 1 ? 45 : 25}deg) scale(${scale})`,
        transition: 'transform 0.2s ease-out',
        transformOrigin: 'center center'
      }}
    >
      <div className={`blue-circle-inner ${scale === 1 ? 'wiggling' : ''}`}>
        <div 
          className="blue-circle-eyes"
          style={{ 
            transform: `translateX(-50%) scale(${1 / scale})`,
            transition: 'transform 0.2s ease-out',
            animationPlayState: scale === 1 ? 'running' : 'paused'
          }}
        >
          <div className="blue-circle-eye"></div>
          <div className="blue-circle-eye"></div>
        </div>
        
        {showPoints && points && (
          <div 
            className="blue-circle-points"
            style={{ 
              transform: `scale(${1 / scale})`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            <div className="blue-circle-points-total">{points.total}</div>
            <div className="blue-circle-points-label">Points!</div>
            <div className="blue-circle-points-details">
              <div>Base: {points.basePoints}</div>
              {points.timeBonus !== 0 && (
                <div className={points.timeBonus > 0 ? 'bonus' : 'penalty'}>
                  Time: {points.timeBonus > 0 ? '+' : ''}{points.timeBonus}
                </div>
              )}
              {points.noPauseBonus > 0 && (
                <div className="bonus">No-Pause: +{points.noPauseBonus}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlueCircle;
