import { useState, useRef } from 'react';
import './UserSelector.css';
import UserEditModal from './UserEditModal';

function UserSelector({ users, currentUser, onSelectUser, onAddUser, onSelectOpenList, isOpenListSelected, onUpdateUser }) {
  const [swipedId, setSwipedId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const scrollRef = useRef(null);
  
  // Use ref for immediate gesture state (no async React state delays)
  const gestureRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    targetPillId: null,
    gestureMode: 'idle', // 'idle' | 'pressing' | 'scroll' | 'swipe'
    holdTimeout: null
  });

  const handleContainerTouchStart = (e) => {
    const target = e.target.closest('.user-pill-wrapper');
    const pillId = target?.dataset.userId;
    
    const gesture = gestureRef.current;
    gesture.startX = e.touches[0].clientX;
    gesture.startY = e.touches[0].clientY;
    gesture.startTime = Date.now();
    gesture.targetPillId = pillId || null;
    gesture.gestureMode = 'pressing';
    
    // Start 200ms hold timer
    gesture.holdTimeout = setTimeout(() => {
      // Only promote to scroll if still pressing with minimal movement
      if (gesture.gestureMode === 'pressing') {
        gesture.gestureMode = 'scroll';
      }
    }, 200);
  };

  const handleContainerTouchMove = (e) => {
    const gesture = gestureRef.current;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = gesture.startX - currentX;
    const diffY = gesture.startY - currentY;
    const timeDiff = Date.now() - gesture.startTime;
    const velocityX = Math.abs(diffX) / timeDiff; // pixels per millisecond
    const velocityY = Math.abs(diffY) / timeDiff;
    
    // If in scroll mode, manually scroll the container
    if (gesture.gestureMode === 'scroll') {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += diffX;
        gesture.startX = currentX; // Update for next move
      }
      return;
    }
    
    // Always prevent default to block native scrolling
    e.preventDefault();
    
    // Fast horizontal swipe: velocity > 1.2 px/ms and distance > 20px → edit mode
    if (gesture.targetPillId && gesture.gestureMode === 'pressing' && velocityX > 1.2 && Math.abs(diffX) > 20) {
      clearTimeout(gesture.holdTimeout);
      gesture.gestureMode = 'swipe';
      
      if (diffX > 0) {
        // Fast swipe left - show edit
        setSwipedId(Number(gesture.targetPillId));
      } else {
        // Fast swipe right - close edit
        setSwipedId(null);
      }
    }
  };

  const handleContainerTouchEnd = (e) => {
    const gesture = gestureRef.current;
    
    // Clear timer and reset
    if (gesture.holdTimeout) {
      clearTimeout(gesture.holdTimeout);
    }
    
    // Detect slow swipes based on distance (for touchend without velocity trigger)
    if (gesture.gestureMode === 'pressing' && gesture.targetPillId) {
      const currentX = e.changedTouches[0].clientX;
      const diffX = gesture.startX - currentX;
      
      // Horizontal swipes
      // Swipe left > 20px = open edit
      if (diffX > 20) {
        setSwipedId(Number(gesture.targetPillId));
      }
      // Swipe right > 20px = close edit
      else if (diffX < -20) {
        setSwipedId(null);
      }
    }
    
    gesture.gestureMode = 'idle';
    gesture.startX = 0;
    gesture.startY = 0;
    gesture.startTime = 0;
    gesture.targetPillId = null;
    gesture.holdTimeout = null;
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setSwipedId(null);
  };

  const handleSaveUser = async (userData) => {
    if (onUpdateUser) {
      await onUpdateUser(editingUser.id, userData);
    }
    setEditingUser(null);
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

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}

export default UserSelector;
