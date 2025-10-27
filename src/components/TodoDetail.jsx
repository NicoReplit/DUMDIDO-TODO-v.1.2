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
    const timeDiffMinutes = Math.round((estimatedSeconds - actualTimeSeconds) / 60);
    const timeBonus = superPointUsed ? 0 : timeDiffMinutes;
    
    let subtotal = basePoints + timeBonus;
    const noPauseBonus = (!pauseUsed && !superPointUsed) ? Math.round(subtotal * 0.1) : 0;
    
    const total = Math.max(0, subtotal + noPauseBonus);
    
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = todo.estimated_minutes 
    ? ((timeRemaining / (todo.estimated_minutes * 60)) * 100)
    : 0;

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
        <button className="back-btn" onClick={handleBack}>← Back</button>
      </div>

      <div className="detail-content">
        <h1>{todo.title}</h1>
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
              <div className="timer-circle" style={{
                background: `conic-gradient(#667eea ${progress}%, #e5e7eb ${progress}%)`
              }}>
                <div className="timer-inner">
                  <div className="timer-display">{formatTime(timeRemaining)}</div>
                  <div className="timer-label">
                    {timeRemaining === 0 ? 'Time\'s up!' : 'remaining'}
                  </div>
                </div>
              </div>
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

              {timeRemaining === 0 && (
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
