import React from 'react';
import './QuarterCircle.css';

function QuarterCircle() {
  return (
    <div className="quarter-circle-wrapper">
      <div className="quarter-circle-inner">
        <svg 
          className="quarter-circle-cross" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24"
        >
          <line 
            x1="4" 
            y1="4" 
            x2="20" 
            y2="20" 
            stroke="#FFFFFF" 
            strokeWidth="8" 
            strokeLinecap="round"
          />
          <line 
            x1="20" 
            y1="4" 
            x2="4" 
            y2="20" 
            stroke="#FFFFFF" 
            strokeWidth="8" 
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default QuarterCircle;
