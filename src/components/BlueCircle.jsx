import { useState, useEffect, useRef } from 'react';
import './BlueCircle.css';

function BlueCircle({ celebrationTick }) {
  const [scale, setScale] = useState(1);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (celebrationTick > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setScale(7.56);
      
      timeoutRef.current = setTimeout(() => {
        setScale(1);
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
      </div>
    </div>
  );
}

export default BlueCircle;
