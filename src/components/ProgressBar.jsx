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
          {/* Eyes icon - positioned on yellow pill (replace with SVG later) */}
          <div className="yellow-pill-icon">
            👀
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
