import { useState, useRef } from 'react';
import './UserSelector.css';

function UserSelector({ users, currentUser, onSelectUser, onAddUser, onSelectOpenList, isOpenListSelected }) {
  const [swipedId, setSwipedId] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const [isHolding, setIsHolding] = useState(false);
  const [targetPillId, setTargetPillId] = useState(null);
  const scrollRef = useRef(null);

  const handleContainerTouchStart = (e) => {
    // Find which pill was touched
    const target = e.target.closest('.user-pill-wrapper');
    const pillId = target?.dataset.userId;
    
    setTargetPillId(pillId || null);
    setTouchStart(e.touches[0].clientX);
    setTouchStartTime(Date.now());
    setIsHolding(false);
  };

  const handleContainerTouchMove = (e) => {
    if (!touchStart || !touchStartTime) return;
    
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;
    const timeDiff = Date.now() - touchStartTime;
    const velocity = Math.abs(diff) / timeDiff; // pixels per millisecond
    
    // Check if user has held down for 200ms with minimal movement
    if (timeDiff > 200 && Math.abs(diff) < 10 && !isHolding) {
      setIsHolding(true);
      return; // Allow scrolling to start
    }
    
    // If holding, allow scrolling (don't prevent default)
    if (isHolding) {
      return; // Let the scroll happen naturally
    }
    
    // Fast swipe on a pill: velocity > 1.2 px/ms and distance > 40px → edit mode
    if (targetPillId && velocity > 1.2 && Math.abs(diff) > 40) {
      if (diff > 0) {
        // Fast swipe left - show edit
        setSwipedId(Number(targetPillId));
        e.preventDefault();
      } else if (diff < 0) {
        // Fast swipe right - close edit
        setSwipedId(null);
        e.preventDefault();
      }
    } else {
      // Not fast enough for swipe, prevent accidental scrolling
      e.preventDefault();
    }
  };

  const handleContainerTouchEnd = () => {
    setTouchStart(null);
    setTouchStartTime(null);
    setIsHolding(false);
    setTargetPillId(null);
  };

  const handleEditUser = (user) => {
    // TODO: Implement edit user functionality
    console.log('Edit user:', user);
    setSwipedId(null);
  };

  return (
    <div 
      className="user-selector"
      ref={scrollRef}
      onTouchStart={handleContainerTouchStart}
      onTouchMove={handleContainerTouchMove}
      onTouchEnd={handleContainerTouchEnd}
    >
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
          data-user-id={user.id}
          className={`user-pill-wrapper ${swipedId === user.id ? 'swiped' : ''}`}
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
