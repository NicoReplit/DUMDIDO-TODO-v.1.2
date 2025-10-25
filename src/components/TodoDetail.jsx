import { useState, useEffect, useRef } from 'react';
import './TodoDetail.css';

function TodoDetail({ todo, onClose, onUpdate, currentUser }) {
  const [isRunning, setIsRunning] = useState(false);
  const initialTime = todo.remaining_seconds ?? (todo.estimated_minutes ? todo.estimated_minutes * 60 : 0);
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [elapsedTime, setElapsedTime] = useState(todo.actual_time_seconds || 0);
  const [pauseUsed, setPauseUsed] = useState(todo.pause_used || false);
  const [superPointUsed, setSuperPointUsed] = useState(todo.super_point_used || false);
  const [showPointsBreakdown, setShowPointsBreakdown] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(null);
  const intervalRef = useRef(null);
  const timeRemainingRef = useRef(timeRemaining);
  const elapsedTimeRef = useRef(elapsedTime);
  const isRunningRef = useRef(isRunning);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
  }, [elapsedTime]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (isRunningRef.current) {
        onUpdateRef.current({ 
          remaining_seconds: timeRemainingRef.current,
          actual_time_seconds: elapsedTimeRef.current
        });
      }
    };
  }, []);

  const handleStart = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      setTimeRemaining(prev => {
        if (prev > 0) {
          return prev - 1;
        }
        return prev;
      });
    }, 1000);
  };

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    isRunningRef.current = false;
    setIsRunning(false);
    setPauseUsed(true);
    onUpdate({ 
      remaining_seconds: timeRemaining, 
      pause_used: true,
      actual_time_seconds: elapsedTime
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
    const timeDiffMinutes = Math.floor((estimatedSeconds - actualTimeSeconds) / 60);
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    isRunningRef.current = false;
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (isRunning) {
      isRunningRef.current = false;
      setIsRunning(false);
      onUpdate({ 
        remaining_seconds: timeRemaining,
        actual_time_seconds: elapsedTime
      });
    }
    onClose();
  };

  const handleUseSuperPoint = async () => {
    if (currentUser.super_points <= 0) {
      alert('No super points available!');
      return;
    }
    if (window.confirm('Use 1 super point on this task? This will count it as completed on-time.')) {
      setSuperPointUsed(true);
      try {
        await fetch(`/api/users/${currentUser.id}/use-super-point`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Error using super point:', error);
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
