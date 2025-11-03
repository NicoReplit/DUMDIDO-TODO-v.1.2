import { useState } from 'react';
import './BlobCharacters.css';

function BlobCharacters({ onOpenSettings, onOpenList, superPoints = 0 }) {
  const [redBlobDragging, setRedBlobDragging] = useState(false);
  const [blueBlobDragging, setBlueBlobDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragY, setDragY] = useState(0);

  const handleTouchStart = (e, blob) => {
    const touch = e.touches[0];
    setDragStartY(touch.clientY);
    if (blob === 'red') setRedBlobDragging(true);
    if (blob === 'blue') setBlueBlobDragging(true);
  };

  const handleTouchMove = (e, blob) => {
    if (!redBlobDragging && !blueBlobDragging) return;
    const touch = e.touches[0];
    const delta = dragStartY - touch.clientY;
    if (delta > 0) {
      setDragY(delta);
    }
  };

  const handleTouchEnd = (blob) => {
    if (dragY > 100) {
      if (blob === 'red') onOpenSettings?.();
      if (blob === 'blue') onOpenList?.();
    }
    setRedBlobDragging(false);
    setBlueBlobDragging(false);
    setDragY(0);
  };

  return (
    <div className="blob-characters">
      <div className="blob-container">
        {/* Yellow Star Blob with Super Points */}
        <div className="blob blob-star">
          <div className="blob-face blob-star-face">
            <div className="star-points">⭐</div>
            <div className="blob-eyes">
              <div className="blob-eye"></div>
              <div className="blob-eye"></div>
            </div>
          </div>
          {superPoints > 0 && (
            <div className="super-points-badge">
              <div className="super-points-number">{superPoints}</div>
              <div className="super-points-label">SUPER<br/>POINTS</div>
            </div>
          )}
        </div>

        {/* Blue Blob - Swipeable for Open List */}
        <div 
          className={`blob blob-blue ${blueBlobDragging ? 'dragging' : ''}`}
          onTouchStart={(e) => handleTouchStart(e, 'blue')}
          onTouchMove={(e) => handleTouchMove(e, 'blue')}
          onTouchEnd={() => handleTouchEnd('blue')}
          style={{ transform: blueBlobDragging ? `translateY(-${dragY}px)` : '' }}
        >
          <div className="blob-face">
            <div className="blob-eyes">
              <div className="blob-eye"></div>
              <div className="blob-eye"></div>
            </div>
            <div className="blob-mouth blob-mouth-smile"></div>
          </div>
        </div>

        {/* Red/Orange Blob - Swipeable for Settings */}
        <div 
          className={`blob blob-red ${redBlobDragging ? 'dragging' : ''}`}
          onTouchStart={(e) => handleTouchStart(e, 'red')}
          onTouchMove={(e) => handleTouchMove(e, 'red')}
          onTouchEnd={() => handleTouchEnd('red')}
          style={{ transform: redBlobDragging ? `translateY(-${dragY}px)` : '' }}
        >
          <div className="blob-face">
            <div className="blob-eyes">
              <div className="blob-eye"></div>
              <div className="blob-eye"></div>
            </div>
            <div className="blob-mouth blob-mouth-happy"></div>
          </div>
        </div>

        {/* Pink Blob */}
        <div className="blob blob-pink">
          <div className="blob-face">
            <div className="blob-eyes">
              <div className="blob-eye"></div>
              <div className="blob-eye"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="blob-progress-bar"></div>
    </div>
  );
}

export default BlobCharacters;
