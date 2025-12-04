import { useState } from 'react';
import './TodoList.css';

function TodoList({ todos, onEdit, onDelete, onSelect, runningTimers = {} }) {
  const [swipedId, setSwipedId] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  const colors = ['yellow', 'red', 'green', 'blue'];
  
  const getCardColor = (index) => {
    return colors[index % colors.length];
  };

  const getRandomRotation = (id) => {
    const seed = id || 0;
    const random = ((seed * 9301 + 49297) % 233280) / 233280;
    return (random * 4) - 2;
  };

  const handleTouchStart = (e, id, todo) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e, id, todo) => {
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
            className={`dumbledido-todo-wrapper ${swipedId === todo.id ? 'swiped' : ''} ${todo.completed ? 'completed' : ''}`}
            style={{ 
              '--card-rotation': `${getRandomRotation(todo.id)}deg`
            }}
            onTouchStart={(e) => handleTouchStart(e, todo.id, todo)}
            onTouchMove={(e) => handleTouchMove(e, todo.id, todo)}
            onTouchEnd={handleTouchEnd}
          >
            {/* Bottom layer - delete button (right side) - ALWAYS RED #EE4100 */}
            <div className={`pill-layer pill-bottom ${getCardColor(index)}`}>
              <button
                className="action-btn-layer delete-btn-layer"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(todo.id);
                  setSwipedId(null);
                }}
              >
                <img src="/attached_assets/Bin.svg" alt="delete" className="action-svg-icon" />
              </button>
            </div>
            
            {/* Middle layer - edit button (left side) - ALWAYS GREEN #38D247 - Only shown for non-completed todos */}
            {!todo.completed && (
              <div className="pill-layer pill-middle">
                <button
                  className="action-btn-layer edit-btn-layer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(todo);
                    setSwipedId(null);
                  }}
                >
                  <img src="/attached_assets/Pencil.svg" alt="edit" className="action-svg-icon" />
                </button>
              </div>
            )}
            
            {/* Top layer - main content */}
            <div
              className={`dumbledido-todo-card pill-top ${getCardColor(index)} ${todo.completed ? 'completed' : ''}`}
              onClick={() => swipedId !== todo.id && !todo.completed && onSelect(todo)}
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
                <div className="status-icon done-icon">
                  <img src="/attached_assets/Check Mark Todo.svg" alt="done" className="status-svg-icon" />
                </div>
              )}
              {!todo.completed && !runningTimers[todo.id] && todo.remaining_seconds !== null && 
               todo.remaining_seconds < (todo.estimated_minutes * 60) && (
                <div className="status-icon pause-icon">
                  <img src="/attached_assets/Pause Todo.svg" alt="paused" className="status-svg-icon" />
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TodoList;
