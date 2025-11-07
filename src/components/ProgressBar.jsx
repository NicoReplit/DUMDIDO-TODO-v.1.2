import './ProgressBar.css';

function ProgressBar({ points = 0, maxPoints = 1000 }) {
  const percentage = (points / maxPoints) * 100;
  
  // Starting sizes at 0 points:
  // - Red pill: 50px (circle)
  // - Yellow pill: 90px
  
  // Calculate width using calc() to maintain pixel-based starting sizes
  // Red: 50px base + percentage growth
  // Yellow: 90px base + percentage growth (same rate, 40px ahead)
  
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
