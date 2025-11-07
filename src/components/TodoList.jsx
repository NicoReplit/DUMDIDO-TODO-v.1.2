import { useState } from 'react';
import './TodoList.css';

function TodoList({ todos, onEdit, onDelete, onSelect, runningTimers = {} }) {
  const [swipedId, setSwipedId] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  const colors = ['yellow', 'red', 'green', 'blue'];
  
  const getCardColor = (index) => {
    return colors[index % colors.length];
  };

  const getAlternatingRotation = (index) => {
    // Alternate between positive and negative rotation
    // Even index: +1 degree, Odd index: -1 degree
    const baseRotation = 1; // 1 degree base
    return (index % 2 === 0) ? baseRotation : -baseRotation;
  };

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
    if (seconds === null || seconds === undefined) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="todo-list dumbledido-todo-list">
      {todos.length === 0 ? (
        <div className="empty-state">
          <p>Keine Aufgaben für heute</p>
          <p className="empty-hint">Tippe auf + um eine hinzuzufügen</p>
        </div>
      ) : (
        todos.map((todo, index) => (
          <div
            key={todo.id}
            className="dumbledido-todo-container"
            style={{ 
              '--sticky-top': `${index * 30}px`,
              '--card-z-index': 100 + index
            }}
          >
            {/* Action buttons layer - positioned behind the card */}
            <div className="action-buttons-layer">
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
            
            {/* Swipeable card - sticks as you scroll */}
            <div
              className={`dumbledido-todo-card ${getCardColor(index)} ${todo.completed ? 'completed' : ''} ${swipedId === todo.id ? 'swiped' : ''}`}
              style={{ 
                '--card-rotation': `${getAlternatingRotation(index)}deg`
              }}
              onClick={() => {
                if (swipedId !== todo.id) {
                  onSelect(todo);
                }
              }}
              onTouchStart={(e) => handleTouchStart(e, todo.id)}
              onTouchMove={(e) => handleTouchMove(e, todo.id)}
              onTouchEnd={handleTouchEnd}
            >
              <div className="todo-card-content">
                <h3 className="dumbledido-todo-title">{todo.title}</h3>
              </div>
              <div className="todo-time-badge">
                {todo.remaining_seconds !== null && !todo.completed
                  ? formatTime(todo.remaining_seconds)
                  : todo.estimated_minutes
                  ? `${todo.estimated_minutes} Min`
                  : '--'}
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
          </div>
        ))
      )}
    </div>
  );
}

export default TodoList;
