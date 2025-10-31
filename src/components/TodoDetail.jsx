import { useState, useEffect, useRef } from 'react';
import './TodoDetail.css';

function TodoDetail({ todo, onClose, onUpdate, currentUser, startTimer, stopTimer, getTimerState }) {
  const timerState = getTimerState(todo.id);
  const [isRunning, setIsRunning] = useState(!!timerState);
  const [timeRemaining, setTimeRemaining] = useState(
    timerState ? timerState.timeRemaining : (todo.remaining_seconds ?? (todo.estimated_minutes ? todo.estimated_minutes * 60 : 0))
  );
  const [elapsedTime, setElapsedTime] = useState(
    timerState ? timerState.elapsedTime : (todo.actual_time_seconds || 0)
  );
  const [pauseUsed, setPauseUsed] = useState(todo.pause_used || false);
  const [superPointUsed, setSuperPointUsed] = useState(todo.super_point_used || false);
  const [showPointsBreakdown, setShowPointsBreakdown] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(null);

  useEffect(() => {
    const currentTimerState = getTimerState(todo.id);
    if (currentTimerState) {
      setTimeRemaining(currentTimerState.timeRemaining);
      setElapsedTime(currentTimerState.elapsedTime);
      setIsRunning(true);
    }
    
    const interval = setInterval(() => {
      const state = getTimerState(todo.id);
      if (state) {
        setTimeRemaining(state.timeRemaining);
        setElapsedTime(state.elapsedTime);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [todo.id, getTimerState]);

  const handleStart = () => {
    setIsRunning(true);
    startTimer(todo.id, timeRemaining, elapsedTime);
  };

  const handlePause = () => {
    stopTimer(todo.id);
    setIsRunning(false);
    setPauseUsed(true);
    onUpdate({ 
      remaining_seconds: timeRemaining, 
      pause_used: true,
      actual_time_seconds: elapsedTime,
      super_point_used: superPointUsed
    });
    onClose();
  };

  const calculatePoints = () => {
    if (!todo.estimated_minutes || todo.estimated_minutes === 0) {
      return { total: 0, basePoints: 0, timeBonus: 0, noPauseBonus: 0, actualTimeSeconds: elapsedTime };
    }

    const estimatedSeconds = todo.estimated_minutes * 60;
    const actualTimeSeconds = elapsedTime;
    
    const basePoints = todo.estimated_minutes;
    const timeDiffSeconds = estimatedSeconds - actualTimeSeconds;
    
    // For overtime (negative diff), use floor to immediately apply penalty at 0:00 overtime
    // For early finish (positive diff), use round for fair rounding
    let timeDiffMinutes;
    if (timeDiffSeconds < 0) {
      // Overtime: floor makes any overtime count as full minute penalty
      timeDiffMinutes = Math.floor(timeDiffSeconds / 60);
    } else {
      // Early or on-time: round normally
      timeDiffMinutes = Math.round(timeDiffSeconds / 60);
    }
    
    const timeBonus = superPointUsed ? 0 : timeDiffMinutes;
    
    let subtotal = basePoints + timeBonus;
    
    const noPauseBonus = (!pauseUsed && !superPointUsed && subtotal > 0) 
      ? Math.round(subtotal * 0.1) 
      : 0;
    
    const total = subtotal + noPauseBonus;
    
    return { 
      total, 
      basePoints, 
      timeBonus, 
      noPauseBonus,
      actualTimeSeconds
    };
  };

  const handleDone = () => {
    stopTimer(todo.id);
    setIsRunning(false);
    
    const points = calculatePoints();
    setEarnedPoints(points);
    setShowPointsBreakdown(true);
    
    setTimeout(() => {
      onUpdate({ 
        completed: true, 
        remaining_seconds: 0,
        pause_used: pauseUsed,
        super_point_used: superPointUsed,
        points_earned: points.total,
        actual_time_seconds: points.actualTimeSeconds
      });
      onClose();
    }, 3000);
  };

  const formatTime = (seconds) => {
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOvertime = timeRemaining < 0;
  
  const countdownTime = isOvertime ? 0 : timeRemaining;
  const overtimeSeconds = isOvertime ? Math.abs(timeRemaining) : 0;
  
  const countdownProgress = todo.estimated_minutes 
    ? Math.max(0, Math.min(100, ((countdownTime / (todo.estimated_minutes * 60)) * 100)))
    : 0;
  
  const overtimeMinute = Math.floor(overtimeSeconds / 60);
  const secondsInCurrentMinute = overtimeSeconds % 60;
  const progressInMinute = (secondsInCurrentMinute / 60) * 100;
  
  // Color gradient from #d0ea2b to #a7194b over 10 minutes (color wheel clockwise)
  const overtimeColors = [
    '#d0ea2b', // yellow-green (minute 0)
    '#ead42b', // yellow (minute 1)
    '#eab72b', // amber-yellow (minute 2)
    '#ea9a2b', // orange-yellow (minute 3)
    '#ea7d2b', // orange (minute 4)
    '#ea5f2b', // red-orange (minute 5)
    '#ea422b', // orange-red (minute 6)
    '#de2b3a', // red (minute 7)
    '#cb2643', // dark red (minute 8)
    '#b9204b', // darker red (minute 9)
    '#a7194b', // pure red (minute 10+)
  ];
  
  const getOvertimeRings = () => {
    const rings = [];
    
    // Add completed minutes as full rings
    for (let i = 0; i < overtimeMinute; i++) {
      const colorIndex = Math.min(i, overtimeColors.length - 1);
      rings.push({
        progress: 100,
        color: overtimeColors[colorIndex]
      });
    }
    
    // Add current growing minute
    const currentColorIndex = Math.min(overtimeMinute, overtimeColors.length - 1);
    rings.push({
      progress: progressInMinute,
      color: overtimeColors[currentColorIndex]
    });
    
    return rings;
  };

  const handleBack = () => {
    onClose();
  };

  const handleUseSuperPoint = async () => {
    if (currentUser.super_points <= 0) {
      alert('No super points available!');
      return;
    }
    if (window.confirm('Use 1 super point on this task? This will count it as completed on-time.')) {
      try {
        const response = await fetch(`/api/users/${currentUser.id}/use-super-point`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          const error = await response.text();
          alert(`Failed to use super point: ${error}`);
          return;
        }
        
        setSuperPointUsed(true);
        onUpdate({ super_point_used: true });
      } catch (error) {
        console.error('Error using super point:', error);
        alert('Failed to use super point. Please try again.');
      }
    }
  };

  return (
    <div className="todo-detail">
      <div className="detail-header">
        <h2 className="detail-header-title">{todo.title}</h2>
        <button className="close-btn" onClick={handleBack}>×</button>
      </div>

      <div className="detail-content">
        {todo.description && (
          <p className="detail-description">{todo.description}</p>
        )}

        {showPointsBreakdown && earnedPoints && (
          <div className="points-celebration">
            <h2>🎉 Task Complete! 🎉</h2>
            <div className="points-breakdown">
              <div className="points-total">{earnedPoints.total} Points!</div>
              <div className="points-details">
                <div>Base Points: {earnedPoints.basePoints}</div>
                {earnedPoints.timeBonus !== 0 && (
                  <div className={earnedPoints.timeBonus > 0 ? 'bonus' : 'penalty'}>
                    Time {earnedPoints.timeBonus > 0 ? 'Bonus' : 'Penalty'}: {earnedPoints.timeBonus > 0 ? '+' : ''}{earnedPoints.timeBonus}
                  </div>
                )}
                {earnedPoints.noPauseBonus > 0 && (
                  <div className="bonus">No-Pause Bonus: +{earnedPoints.noPauseBonus}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {!showPointsBreakdown && (
          <>
            <div className="timer-container">
              {!isOvertime && (
                <div className="timer-circle" style={{
                  background: `conic-gradient(#65b032 ${countdownProgress}%, #e5e7eb ${countdownProgress}%)`
                }}>
                  <div className="timer-inner">
                    <div className="timer-display" style={{ color: '#65b032' }}>
                      {formatTime(countdownTime)}
                    </div>
                    <div className="timer-label">
                      {countdownTime === 0 ? 'Time\'s up!' : 'remaining'}
                    </div>
                  </div>
                </div>
              )}
              
              {isOvertime && (
                <div className="timer-circle-svg-container">
                  <svg className="timer-svg" viewBox="0 0 200 200">
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                    />
                    
                    {/* Overlapping colored rings */}
                    {getOvertimeRings().map((ring, index) => {
                      const circumference = 2 * Math.PI * 85;
                      const strokeDashoffset = circumference - (ring.progress / 100) * circumference;
                      
                      return (
                        <circle
                          key={index}
                          cx="100"
                          cy="100"
                          r="85"
                          fill="none"
                          stroke={ring.color}
                          strokeWidth="12"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          transform="rotate(-90 100 100)"
                        />
                      );
                    })}
                  </svg>
                  <div className="timer-inner">
                    <div className="timer-display" style={{ color: '#a7194b' }}>
                      +{formatTime(overtimeSeconds)}
                    </div>
                    <div className="timer-label" style={{ color: '#a7194b' }}>
                      OVERTIME
                    </div>
                  </div>
                </div>
              )}
            </div>

            {currentUser && currentUser.super_points > 0 && !superPointUsed && (
              <div className="super-point-section">
                <button className="super-point-btn" onClick={handleUseSuperPoint}>
                  ⭐ Use Super Point ({currentUser.super_points} available)
                </button>
                {superPointUsed && <p className="super-point-used">Super point activated! ⭐</p>}
              </div>
            )}

            {superPointUsed && (
              <p className="super-point-active">⭐ Super Point Active - This task counts as on-time!</p>
            )}

            <div className="detail-actions">
              {!isRunning && timeRemaining > 0 && (
                <button className="start-btn" onClick={handleStart}>
                  Start
                </button>
              )}
              
              {isRunning && (
                <>
                  <button className="pause-btn" onClick={handlePause}>
                    ⏸️ Pause
                  </button>
                  <button className="done-btn" onClick={handleDone}>
                    ✓ Done
                  </button>
                </>
              )}

              {!isRunning && timeRemaining <= 0 && (
                <button className="done-btn full-width" onClick={handleDone}>
                  ✓ Mark as Done
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoDetail;
