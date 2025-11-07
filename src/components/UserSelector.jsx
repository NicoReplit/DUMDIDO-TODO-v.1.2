import { useState } from 'react';
import './UserSelector.css';

function UserSelector({ users, currentUser, onSelectUser, onAddUser, onSelectOpenList, isOpenListSelected }) {
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
