import { useState, useEffect } from 'react';
import './PerfectDayCelebration.css';

function PerfectDayCelebration({ isActive, onClose }) {
  const [stars, setStars] = useState([]);
  const [showStars, setShowStars] = useState(true);

  useEffect(() => {
    if (isActive) {
      // Generate 30 stars with random positions and delays
      const newStars = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Random horizontal position (%)
        delay: Math.random() * 1.5, // Random delay (0-1.5s)
        duration: 3 + Math.random() * 2, // Random fall duration (3-5s)
      }));
      setStars(newStars);
      setShowStars(true);

      // Stop stars after 4 seconds (when blue circle animation ends)
      const starTimer = setTimeout(() => {
        setShowStars(false);
      }, 4000);

      // Auto-close after 5 seconds
      const closeTimer = setTimeout(() => {
        if (onClose) onClose();
      }, 5000);

      return () => {
        clearTimeout(starTimer);
        clearTimeout(closeTimer);
      };
    } else {
      setStars([]);
      setShowStars(true);
    }
  }, [isActive, onClose]);

  if (!isActive) return null;

  return (
    <div className="perfect-day-overlay">
      {/* Firework stars */}
      {showStars && stars.map((star) => (
        <div
          key={star.id}
          className="firework-star"
          style={{
            left: `${star.x}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
      <div className="perfect-day-center">
        <div className="perfect-day-yeah">YEAH!</div>
        <div className="perfect-day-number">10</div>
        <div className="perfect-day-points">PUNKTE</div>
        <div className="perfect-day-gewonnen">gewonnen</div>
      </div>
    </div>
  );
}

export default PerfectDayCelebration;
