import './ProgressBar.css';

function ProgressBar({ points = 0, maxPoints = 1000 }) {
  const percentage = (points / maxPoints) * 100;
  
  // Starting sizes at 0 points:
  // - Red pill: 40px (perfect circle)
  // - Yellow pill: 90px
  
  // Calculate width using calc() to maintain pixel-based starting sizes
  // Red: 40px base + percentage growth
  // Yellow: 90px base + percentage growth (same rate, 50px ahead)
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-outer">
        {/* Yellow pill - starts at 90px, grows with percentage */}
        <div 
          className="progress-bar-yellow"
          style={{ width: `calc(90px + ${percentage}%)` }}
        >
          {/* Single eye icon - positioned on yellow pill */}
          <div className="yellow-pill-icon">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="12" fill="white" />
              <circle cx="20" cy="15" r="5.4" fill="black" />
            </svg>
          </div>
        </div>
        
        {/* Red/Coral pill - starts at 40px (perfect circle), grows with percentage */}
        <div 
          className="progress-bar-coral" 
          style={{ width: `calc(40px + ${percentage}%)` }}
        ></div>
        
        {/* Points counter - positioned on left */}
        <div className="progress-points">{points}</div>
      </div>
    </div>
  );
}

export default ProgressBar;
