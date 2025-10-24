import { useState, useEffect, useRef } from 'react';
import './TodoDetail.css';

function TodoDetail({ todo, onClose, onUpdate }) {
  const [isRunning, setIsRunning] = useState(false);
  const initialTime = todo.remaining_seconds ?? (todo.estimated_minutes ? todo.estimated_minutes * 60 : 0);
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const intervalRef = useRef(null);
  const timeRemainingRef = useRef(timeRemaining);
  const isRunningRef = useRef(isRunning);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

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
        onUpdateRef.current({ remaining_seconds: timeRemainingRef.current });
      }
    };
  }, []);

  const handleStart = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          isRunningRef.current = false;
          setIsRunning(false);
          onUpdate({ remaining_seconds: 0 });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    isRunningRef.current = false;
    setIsRunning(false);
    onUpdate({ remaining_seconds: timeRemaining });
    onClose();
  };

  const handleDone = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    isRunningRef.current = false;
    setIsRunning(false);
    onUpdate({ completed: true, remaining_seconds: 0 });
    onClose();
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
      onUpdate({ remaining_seconds: timeRemaining });
    }
    onClose();
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
      </div>
    </div>
  );
}

export default TodoDetail;
