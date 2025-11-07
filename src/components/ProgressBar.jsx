import './ProgressBar.css';

function ProgressBar({ points = 0, maxPoints = 1000 }) {
  const percentage = (points / maxPoints) * 100;
  
  // Starting sizes at 0 points:
  // - Red pill: 50px (circle)
  // - Yellow pill: 80px
  
  // Calculate width using calc() to maintain pixel-based starting sizes
  // Red: 50px base + percentage growth
  // Yellow: 80px base + percentage growth (same rate, 30px ahead)
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-outer">
        {/* Yellow pill - starts at 80px, grows with percentage */}
        <div 
          className="progress-bar-yellow"
          style={{ width: `calc(80px + ${percentage}%)` }}
        >
          {/* Heart emoji with eyes - positioned on yellow pill */}
          <div className="progress-emoji">
            <div className="heart-emoji">
              <div className="heart-eyes">
                <div className="heart-eye"></div>
                <div className="heart-eye"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Red/Coral pill - starts at 50px (circle), grows with percentage */}
        <div 
          className="progress-bar-coral" 
          style={{ width: `calc(50px + ${percentage}%)` }}
        ></div>
        
        {/* Points counter - positioned on left */}
        <div className="progress-points">{points}</div>
      </div>
    </div>
  );
}

export default ProgressBar;
