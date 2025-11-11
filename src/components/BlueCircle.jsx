import { useState, useEffect, useRef } from 'react';
import './BlueCircle.css';

function BlueCircle({ celebrationTick, points }) {
  const [scale, setScale] = useState(1);
  const [showPoints, setShowPoints] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (celebrationTick > 0) {
      console.log('🎉 CELEBRATION TRIGGERED!');
      console.log('celebrationTick:', celebrationTick);
      console.log('points data:', points);
      console.log('scale will be:', 7.56);
      console.log('showPoints will be:', true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setScale(7.56);
      setShowPoints(true);
      
      timeoutRef.current = setTimeout(() => {
        console.log('🔵 Celebration ending - scaling back to 1');
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
  }, [celebrationTick, points]);

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
        
        {(() => {
          const shouldShow = (scale === 7.56 || showPoints) && points;
          console.log('🔍 RENDER CHECK:');
          console.log('  scale:', scale);
          console.log('  showPoints:', showPoints);
          console.log('  points exists:', !!points);
          console.log('  shouldShow:', shouldShow);
          if (points) {
            console.log('  points.total:', points.total);
            console.log('  points.basePoints:', points.basePoints);
          }
          return shouldShow ? (
            <div 
              className="blue-circle-points"
              style={{ 
                top: '50%',
                transform: `translate(-50%, -50%) scale(${1 / scale})`,
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
          ) : null;
        })()}
      </div>
    </div>
  );
}

export default BlueCircle;
