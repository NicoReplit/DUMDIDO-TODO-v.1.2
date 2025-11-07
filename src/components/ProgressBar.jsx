import './ProgressBar.css';

function ProgressBar({ points = 0, maxPoints = 1000 }) {
  const percentage = Math.min((points / maxPoints) * 100, 100);
  
  // Pill height is 50px (from CSS)
  const pillHeight = 50;
  
  // Red pill: minimum is a circle (50px), grows with percentage
  // At 0 points: 50px (circle), at max points: 100%
  const redPillPercent = Math.max(5, percentage); // Minimum 5% to ensure circle
  
  // Yellow pill: should be ahead of red pill by a constant offset
  // At 117 points (11.7%), yellow should be where red currently is (11.7%)
  // This means yellow = red + constant offset
  // Offset = 0% at current design (they were the same), but we want yellow ahead
  // Let's set offset so yellow is always slightly ahead
  const offsetPercent = 5; // Yellow is always 5% ahead of red
  const yellowPillPercent = Math.max(5, Math.min(percentage + offsetPercent, 100));
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-outer">
        {/* Yellow pill - scales with points + offset */}
        <div 
          className="progress-bar-yellow"
          style={{ width: `${yellowPillPercent}%` }}
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
        
        {/* Red/Coral pill - grows from circle to full */}
        <div 
          className="progress-bar-coral" 
          style={{ width: `${redPillPercent}%` }}
        ></div>
        
        {/* Points counter - positioned on right */}
        <div className="progress-points">{points}</div>
      </div>
    </div>
  );
}

export default ProgressBar;
