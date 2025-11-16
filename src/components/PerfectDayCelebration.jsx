import { useState, useEffect } from 'react';
import './PerfectDayCelebration.css';

function PerfectDayCelebration({ isActive, onClose }) {
  const [stars, setStars] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Generate 30 rays bursting outward in all directions
      const newStars = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        angle: (360 / 30) * i, // Evenly distributed around circle
        delay: Math.random() * 0.3, // Random delay (0-0.3s)
        distance: 40 + Math.random() * 20, // Random distance (40-60vh)
      }));
      setStars(newStars);
      setIsClosing(false);

      // Start closing animation after 1.5 seconds
      const closeAnimTimer = setTimeout(() => {
        setIsClosing(true);
      }, 1500);

      // Auto-close after 2 seconds
      const closeTimer = setTimeout(() => {
        if (onClose) onClose();
      }, 2000);

      return () => {
        clearTimeout(closeAnimTimer);
        clearTimeout(closeTimer);
      };
    } else {
      setStars([]);
      setIsClosing(false);
    }
  }, [isActive, onClose]);

  if (!isActive) return null;

  return (
    <div className={`perfect-day-overlay ${isClosing ? 'closing' : ''}`}>
      {/* Firework rays bursting outward */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="firework-ray"
          style={{
            '--angle': `${star.angle}deg`,
            '--distance': `${star.distance}vh`,
            animationDelay: `${star.delay}s`,
          }}
        >
          <svg width="80" height="80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
              fill="#FECE00"
              stroke="#FECE00"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}

      {/* Center text */}
      <div className={`perfect-day-center ${isClosing ? 'closing' : ''}`}>
        <div className="perfect-day-monaterstark">Monaterstark!</div>
        <div className="perfect-day-number">10</div>
        <div className="perfect-day-bonus">Bonus</div>
        <div className="perfect-day-punkte">Punkte</div>
        <div className="perfect-day-verdient">Verdient.</div>
      </div>
    </div>
  );
}

export default PerfectDayCelebration;
