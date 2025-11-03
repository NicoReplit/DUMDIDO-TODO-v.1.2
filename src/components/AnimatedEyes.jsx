import { useEffect, useState } from 'react';
import './AnimatedEyes.css';

function AnimatedEyes({ closed = false, size = 'medium' }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (closed) return;

    const randomizeRotation = () => {
      const angles = [-30, -15, 0, 15, 30, 45];
      const randomAngle = angles[Math.floor(Math.random() * angles.length)];
      setRotation(randomAngle);
    };

    // Randomize on mount
    randomizeRotation();

    // Randomize every 2-4 seconds
    const interval = setInterval(() => {
      randomizeRotation();
    }, 2000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [closed]);

  if (closed) {
    return (
      <div className={`animated-eyes ${size} closed`}>
        <div className="closed-eye"></div>
        <div className="closed-eye"></div>
      </div>
    );
  }

  return (
    <div className={`animated-eyes ${size}`}>
      <div className="animated-eye">
        <div 
          className="eye-pupil"
          style={{ transform: `rotate(${rotation}deg) translateX(3px)` }}
        ></div>
      </div>
      <div className="animated-eye">
        <div 
          className="eye-pupil"
          style={{ transform: `rotate(${rotation}deg) translateX(3px)` }}
        ></div>
      </div>
    </div>
  );
}

export default AnimatedEyes;
