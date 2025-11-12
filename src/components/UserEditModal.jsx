import { useState } from 'react';
import './UserEditModal.css';

const AVAILABLE_COLORS = [
  '#FECE00', // Yellow
  '#0061EE', // Blue
  '#FF006E', // Pink
  '#EE4100', // Coral/Red
  '#38D247', // Green
];

function UserEditModal({ user, onClose, onSave, onDelete, onResetTodos, onResetPoints }) {
  const [name, setName] = useState(user?.name || '');
  const [color, setColor] = useState(user?.color || AVAILABLE_COLORS[0]);
  const [showResetConfirm, setShowResetConfirm] = useState(null); // 'todos' or 'points'
  const [pin, setPin] = useState('');
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pendingResetAction, setPendingResetAction] = useState(null);

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    const userData = {
      name: name.toUpperCase(),
      color
    };

    await onSave(userData);
    onClose();
  };

  const handleResetClick = (type) => {
    setShowResetConfirm(type);
  };

  const handleResetConfirmed = async () => {
    // Check if global PIN is set
    try {
      const response = await fetch('/api/settings/has-pin');
      const data = await response.json();
      
      if (data.hasPin) {
        // Show PIN entry
        setPendingResetAction(showResetConfirm);
        setShowResetConfirm(null);
        setShowPinEntry(true);
      } else {
        // No PIN, show final confirmation
        showFinalConfirmation(showResetConfirm);
      }
    } catch (error) {
      console.error('Error checking PIN:', error);
    }
  };

  const handlePinSubmit = async () => {
    try {
      const response = await fetch('/api/settings/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      
      const data = await response.json();
      
      if (data.valid) {
        setShowPinEntry(false);
        setPin('');
        // Show final confirmation
        showFinalConfirmation(pendingResetAction);
      } else {
        alert('Incorrect PIN');
        setPin('');
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
    }
  };

  const showFinalConfirmation = (type) => {
    const message = type === 'todos' 
      ? 'Are you really sure you want to delete ALL to-dos for this user? This cannot be undone!'
      : 'Are you really sure you want to reset ALL points for this user? This cannot be undone!';
    
    if (window.confirm(message)) {
      if (type === 'todos') {
        onResetTodos(user.id);
      } else {
        onResetPoints(user.id);
      }
      onClose();
    }
    setPendingResetAction(null);
  };

  // First confirmation dialog
  if (showResetConfirm) {
    const message = showResetConfirm === 'todos'
      ? 'This will delete ALL to-dos for this user. Do you want to continue?'
      : 'This will reset ALL points (points, super points, and streak) for this user. Do you want to continue?';
    
    return (
      <div className="modal-overlay" onClick={() => setShowResetConfirm(null)}>
        <div className="modal-content reset-confirm-modal" onClick={(e) => e.stopPropagation()}>
          <h2>⚠️ Confirm Reset</h2>
          <p className="warning-text">{message}</p>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setShowResetConfirm(null)}>
              Cancel
            </button>
            <button className="btn-danger" onClick={handleResetConfirmed}>
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PIN entry dialog
  if (showPinEntry) {
    return (
      <div className="modal-overlay" onClick={() => { setShowPinEntry(false); setPin(''); }}>
        <div className="modal-content pin-entry-modal" onClick={(e) => e.stopPropagation()}>
          <h2>Enter Global PIN</h2>
          <p>Please enter the family PIN to proceed with this action.</p>
          <input
            type="password"
            inputMode="numeric"
            maxLength="4"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 4-digit PIN"
            className="pin-input"
            autoFocus
          />
          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => { setShowPinEntry(false); setPin(''); }}>
              Cancel
            </button>
            <button className="btn-save" onClick={handlePinSubmit} disabled={pin.length !== 4}>
              Verify
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main edit form
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{user ? 'Edit User' : 'New User'}</h2>
        
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="name-input"
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <div className="color-picker">
            {AVAILABLE_COLORS.map((c) => (
              <button
                key={c}
                className={`color-option ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {user && (
          <div className="reset-actions">
            <button className="btn-reset" onClick={() => handleResetClick('todos')}>
              Reset To-dos
            </button>
            <button className="btn-reset" onClick={() => handleResetClick('points')}>
              Reset Points
            </button>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserEditModal;
