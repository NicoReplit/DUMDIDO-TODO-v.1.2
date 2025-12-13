import { useState, useEffect } from 'react';
import './StandbyMode.css';

const defaultImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920'
];

function StandbyMode({ settings, onWake }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!settings.slideshowEnabled) return;

    const slideTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultImages.length);
    }, settings.slideshowInterval * 1000);

    return () => clearInterval(slideTimer);
  }, [settings.slideshowEnabled, settings.slideshowInterval]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="standby-mode" onClick={onWake}>
      <div 
        className="standby-background"
        style={{ backgroundImage: `url(${defaultImages[currentIndex]})` }}
      />
      <div className="standby-overlay" />
      <div className="standby-content">
        <div className="standby-time">{formatTime(currentTime)}</div>
        <div className="standby-date">{formatDate(currentTime)}</div>
        <div className="standby-hint">Tippen zum Aufwecken</div>
      </div>
      {settings.slideshowEnabled && (
        <div className="slideshow-dots">
          {defaultImages.map((_, index) => (
            <div 
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default StandbyMode;
