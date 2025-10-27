import { useState } from 'react';
import './TodoList.css';

function TodoList({ todos, onEdit, onDelete, onSelect, runningTimers = {} }) {
  const [swipedId, setSwipedId] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e, id) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e, id) => {
    if (!touchStart) return;
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;
    
    if (diff > 50) {
      setSwipedId(id);
    } else if (diff < -50) {
      setSwipedId(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="todo-list">
      {todos.length === 0 ? (
        <div className="empty-state">
          <p>No to-dos for today</p>
          <p className="empty-hint">Tap the + button to add one</p>
        </div>
      ) : (
        todos.map(todo => (
          <div
            key={todo.id}
            className={`todo-item-wrapper ${swipedId === todo.id ? 'swiped' : ''}`}
          >
            <div
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
              onClick={() => onSelect(todo)}
              onTouchStart={(e) => handleTouchStart(e, todo.id)}
              onTouchMove={(e) => handleTouchMove(e, todo.id)}
              onTouchEnd={handleTouchEnd}
            >
              <div className="todo-content">
                <h3>{todo.title}</h3>
                {todo.description && <p className="todo-description">{todo.description}</p>}
                <div className="todo-meta">
                  <span className="time-badge">
                    {todo.remaining_seconds !== null && !todo.completed
                      ? `⏱️ ${formatTime(todo.remaining_seconds)}`
                      : todo.estimated_minutes
                      ? `${todo.estimated_minutes} min`
                      : 'No time set'}
                  </span>
                  {todo.recurrence_type && (
                    <span className="recurrence-badge">
                      {todo.recurrence_type === 'daily' ? '🔄 Daily' : '🔄 Weekly'}
                    </span>
                  )}
                </div>
              </div>
              {todo.completed && (
                <div className="completed-check">✓</div>
              )}
              {!todo.completed && runningTimers[todo.id] && (
                <div className="running-indicator">▶️</div>
              )}
              {!todo.completed && !runningTimers[todo.id] && todo.remaining_seconds !== null && 
               todo.remaining_seconds < (todo.estimated_minutes * 60) && (
                <div className="pause-indicator">⏸️</div>
              )}
            </div>
            <div className="action-buttons">
              <button
                className="action-btn edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(todo);
                  setSwipedId(null);
                }}
              >
                ✏️
              </button>
              <button
                className="action-btn delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(todo.id);
                  setSwipedId(null);
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TodoList;
