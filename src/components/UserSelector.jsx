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
    
    // Fast swipe: velocity > 0.5 px/ms and distance > 30px → edit mode
    // Slow swipe: velocity <= 0.5 px/ms → allow scrolling
    if (velocity > 0.5 && Math.abs(diff) > 30) {
      if (diff > 0) {
        setSwipedId(id);
        e.preventDefault(); // Prevent scrolling for fast swipes
      } else {
        setSwipedId(null);
        e.preventDefault();
      }
    }
    // For slow swipes, don't prevent default - let the container scroll
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
      <button 
        className={`user-button open-list-button ${isOpenListSelected ? 'active' : ''}`}
        onClick={onSelectOpenList}
      >
        <div className="user-name">Open List</div>
      </button>
      {users.map(user => (
        <div
          key={user.id}
          className={`user-pill-wrapper ${swipedId === user.id ? 'swiped' : ''}`}
          onTouchStart={(e) => handleTouchStart(e, user.id)}
          onTouchMove={(e) => handleTouchMove(e, user.id)}
          onTouchEnd={handleTouchEnd}
        >
          {/* Middle layer - edit button (only layer shown) - GREEN #38D247 */}
          <div className="user-pill-layer user-pill-middle">
            <button
              className="user-action-btn-layer user-edit-btn-layer"
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(user);
              }}
            >
              ✏️
            </button>
          </div>
          
          {/* Top layer - main content */}
          <button
            className={`user-button user-pill-top ${currentUser?.id === user.id ? 'active' : ''}`}
            style={{
              backgroundColor: user.color,
              color: 'white'
            }}
            onClick={() => onSelectUser(user)}
          >
            <div className="user-name">{user.name}</div>
          </button>
        </div>
      ))}
      <button className="user-add-button" onClick={onAddUser}>
        +
      </button>
    </div>
  );
}

export default UserSelector;
