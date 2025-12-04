import { useState, useEffect, useRef } from 'react';
import './TodoDetail.css';

function TodoDetail({ todo, onClose, onUpdate, currentUser, startTimer, stopTimer, getTimerState, onDone, onPause }) {
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
    
    let timeDiffMinutes;
    if (timeDiffSeconds < 0) {
      timeDiffMinutes = Math.floor(timeDiffSeconds / 60);
    } else {
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
    
    onUpdate({ 
      completed: true, 
      remaining_seconds: 0,
      pause_used: pauseUsed,
      super_point_used: superPointUsed,
      points_earned: points.total,
      actual_time_seconds: points.actualTimeSeconds,
      celebrationPoints: points
    });
    onClose();
  };

  useEffect(() => {
    if (onDone) {
      onDone(handleDone);
    }
    if (onPause) {
      onPause(handlePause);
    }
  }, [timeRemaining, elapsedTime, pauseUsed, superPointUsed]);

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


  // Random rotation for eyes
  const eye1Rotation = useRef(Math.random() * 40 - 20).current; // -20 to +20 degrees
  const eye2Rotation = useRef(Math.random() * 40 - 20).current;

  return (
    <div className="todo-detail">
      <div className="detail-header">
        <button className="close-btn" onClick={handleBack}>
          <img src="/Close.svg" alt="Close" className="close-icon" />
        </button>
      </div>

      <div className="detail-content">
        {todo.description && (
          <p className="detail-description">{todo.description}</p>
        )}

        {(
          <>
            <div className="timer-container">
              {!isOvertime && (
                <div className="timer-circle-wrapper">
                  {/* Show ring only when running */}
                  {isRunning && (
                    <div className="timer-ring" style={{
                      background: `conic-gradient(#65b032 ${countdownProgress}%, transparent ${countdownProgress}%)`
                    }}></div>
                  )}
                  {/* PlayBase.svg when idle, Timer_1.svg when running */}
                  <img 
                    src={isRunning ? "/Timer_1.svg" : "/PlayBase.svg"} 
                    alt="" 
                    className={isRunning ? "timer-active-svg" : "timer-base-svg"} 
                  />
                  <div className="timer-inner">
                    {!isRunning && timeRemaining > 0 ? (
                      <>
                        <img 
                          src="/Play Button.svg" 
                          alt="Start timer" 
                          className="play-btn-circle" 
                          onClick={handleStart}
                        />
                        <div className="estimated-time-circle">
                          {todo.estimated_minutes ? `${todo.estimated_minutes} Min` : 'No estimate'}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="timer-display" style={{ color: 'white' }}>
                          {formatTime(countdownTime)}
                        </div>
                        <div className="timer-label" style={{ color: 'white' }}>
                          {countdownTime === 0 ? 'Time\'s up!' : 'remaining'}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {isOvertime && (
                <div className="timer-circle-wrapper">
                  {/* Overtime ring animation */}
                  <div className="timer-ring overtime-ring" style={{
                    background: `conic-gradient(${overtimeColors[Math.min(overtimeMinute, overtimeColors.length - 1)]} ${progressInMinute}%, transparent ${progressInMinute}%)`
                  }}></div>
                  {/* Cycle through Timer_2 to Timer_5 every minute */}
                  <img 
                    src={`/Timer_${((overtimeMinute % 4) + 2)}.svg`}
                    alt="" 
                    className="timer-active-svg" 
                  />
                  <div className="timer-inner">
                    <div className="timer-display" style={{ color: 'white' }}>
                      +{formatTime(overtimeSeconds)}
                    </div>
                    <div className="timer-label" style={{ color: 'white' }}>
                      OVERTIME
                    </div>
                  </div>
                </div>
              )}
            </div>

            {superPointUsed && (
              <p className="super-point-active">⭐ Super Point Active - This task counts as on-time!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TodoDetail;
