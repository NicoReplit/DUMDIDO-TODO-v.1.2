import { useState, useRef, useEffect } from 'react';
import './TodoMenu.css';

function TodoMenu({ isOpen, onClose, onAddTodo, onOpenList }) {
  const [closing, setClosing] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const swipeThreshold = 50;

  // Block scrolling when menu is open or closing
  useEffect(() => {
    if (isOpen || closing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, closing]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 500);
    setTimeout(() => {
      setClosing(false);
    }, 1500);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('todo-menu-overlay')) {
      handleClose();
    }
  };

  const handleOverlayTouchStart = (e) => {
    if (!isOpen) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleOverlayTouchEnd = (e) => {
    if (!isOpen || touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Check if it's primarily a horizontal or vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe - swipe left to close
      if (Math.abs(deltaX) > swipeThreshold && deltaX < 0) {
        handleClose();
      }
    } else {
      // Vertical swipe - swipe down to close
      if (Math.abs(deltaY) > swipeThreshold && deltaY > 0) {
        handleClose();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleAddTodo = () => {
    onAddTodo();
  };

  const handleOpenList = () => {
    onOpenList();
  };

  return (
    <>
      {/* Menu content with pills */}
      {(isOpen || closing) && (
        <div 
          className="todo-menu-overlay" 
          onClick={handleOverlayClick}
          onTouchStart={handleOverlayTouchStart}
          onTouchEnd={handleOverlayTouchEnd}
        >
          <div className="todo-menu-content" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={handleAddTodo} 
              className={`todo-menu-button ${closing ? 'todo-button-animate-1-close' : 'todo-button-animate-1'}`}
            >
              Neue Aufgabe
            </button>

            <button 
              onClick={handleOpenList} 
              className={`todo-menu-button ${closing ? 'todo-button-animate-2-close' : 'todo-button-animate-2'}`}
            >
              Offene Liste
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TodoMenu;
