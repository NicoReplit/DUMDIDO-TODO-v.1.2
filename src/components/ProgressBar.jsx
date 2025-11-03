import './ProgressBar.css';

function ProgressBar({ points = 0, maxPoints = 1000 }) {
  const percentage = Math.min((points / maxPoints) * 100, 100);
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-outer">
        {/* Yellow base layer */}
        <div className="progress-bar-yellow"></div>
        
        {/* Coral fill layer */}
        <div 
          className="progress-bar-coral" 
          style={{ width: `${percentage}%` }}
        ></div>
        
        {/* Heart emoji with eyes */}
        <div className="progress-emoji">
          <div className="heart-emoji">
            <div className="heart-eyes">
              <div className="heart-eye"></div>
              <div className="heart-eye"></div>
            </div>
          </div>
        </div>
        
        {/* Points counter */}
        <div className="progress-points">{points}</div>
      </div>
    </div>
  );
}

export default ProgressBar;
