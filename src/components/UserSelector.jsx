import { useState } from 'react';
import './UserSelector.css';

function UserSelector({ users, currentUser, onSelectUser, onAddUser, onSelectOpenList, isOpenListSelected }) {
  const [swipedId, setSwipedId] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);

  const handleTouchStart = (e, id) => {
    setTouchStart(e.touches[0].clientX);
    setTouchStartTime(Date.now());
  };

  const handleTouchMove = (e, id) => {
    if (!touchStart || !touchStartTime) return;
    
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;
    const timeDiff = Date.now() - touchStartTime;
    const velocity = Math.abs(diff) / timeDiff; // pixels per millisecond
    
    // Fast swipe: velocity > 1.2 px/ms and distance > 40px → edit mode
    // Slow drag: velocity <= 0.3 px/ms → allow scrolling (hold and drag)
    if (velocity > 1.2 && Math.abs(diff) > 40) {
      if (diff > 0) {
        // Fast swipe left - show edit
        setSwipedId(id);
        e.preventDefault();
      } else if (diff < 0) {
        // Fast swipe right - close edit
        setSwipedId(null);
        e.preventDefault();
      }
    }
    // For slow drags (velocity <= 0.3), allow normal scrolling behavior
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setTouchStartTime(null);
  };

  const handleEditUser = (user) => {
    // TODO: Implement edit user functionality
    console.log('Edit user:', user);
    setSwipedId(null);
  };

  return (
    <div className="user-selector">
      <div className="user-pill-wrapper">
        <div className="user-pill-layer user-pill-bottom">
        </div>
        <div className="user-pill-layer user-pill-top">
          <button 
            className={`user-button open-list-button ${isOpenListSelected ? 'active' : ''}`}
            onClick={onSelectOpenList}
          >
            <div className="user-name">Open List</div>
          </button>
        </div>
      </div>
      {users.map(user => (
        <div
          key={user.id}
          className={`user-pill-wrapper ${swipedId === user.id ? 'swiped' : ''}`}
          onTouchStart={(e) => handleTouchStart(e, user.id)}
          onTouchMove={(e) => handleTouchMove(e, user.id)}
          onTouchEnd={handleTouchEnd}
        >
          {/* Bottom layer - GREEN (#38D247), edit button only */}
          <div className="user-pill-layer user-pill-bottom">
            <button
              className="user-action-btn-layer"
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(user);
              }}
            >
              ✏️
            </button>
          </div>
          
          {/* Top layer - swipeable user pill */}
          <div className="user-pill-layer user-pill-top">
            <button
              className={`user-button ${currentUser?.id === user.id ? 'active' : ''}`}
              style={{
                backgroundColor: user.color,
                color: 'white'
              }}
              onClick={() => onSelectUser(user)}
            >
              <div className="user-name">{user.name}</div>
            </button>
          </div>
        </div>
      ))}
      <button className="user-add-button" onClick={onAddUser}>
        +
      </button>
    </div>
  );
}

export default UserSelector;
