import { useState } from 'react';
import './OpenList.css';

function OpenList({ tasks, onSelect }) {
  const [swipedId, setSwipedId] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
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

  return (
    <div className="open-list">
      <div className="open-list-banner">
        <p className="banner-line">Gewinne 10 Bonus Punkte, wenn du heute eine</p>
        <p className="banner-line">Aufgabe aus der offenen Liste erledigst. Leg los!</p>
      </div>
      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No open tasks available</p>
        </div>
      ) : (
        tasks.map(task => (
          <div
            key={task.id}
            className={`open-task-item ${swipedId === task.id ? 'swiped' : ''}`}
            onClick={() => onSelect(task)}
            onTouchStart={handleTouchStart}
            onTouchMove={(e) => handleTouchMove(e, task.id)}
            onTouchEnd={handleTouchEnd}
          >
            <div className="open-task-content">
              <h3>{task.title}</h3>
              {task.description && <p className="task-description">{task.description}</p>}
              <div className="task-meta">
                <span className="time-badge">
                  ⏱️ {task.estimated_minutes} min
                </span>
                <span className="bonus-badge">
                  🎁 +10 bonus points
                </span>
              </div>
            </div>
            <div className="claim-arrow">›</div>
          </div>
        ))
      )}
    </div>
  );
}

export default OpenList;
