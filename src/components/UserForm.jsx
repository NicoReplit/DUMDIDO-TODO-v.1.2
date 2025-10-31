import { useState, useEffect } from 'react';
import './UserForm.css';

function UserForm({ user, onSave, onCancel, onDelete }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    color: user?.color || '#3B82F6'
  });
  const [pinData, setPinData] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasExistingPin, setHasExistingPin] = useState(false);

  const predefinedColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#EC4899', // Pink
    '#F59E0B', // Orange
    '#8B5CF6', // Purple
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#F97316', // Dark Orange
  ];

  // Check if user has a PIN when editing
  useEffect(() => {
    if (user) {
      fetch(`/api/users/${user.id}/has-pin`)
        .then(res => res.json())
        .then(data => setHasExistingPin(data.hasPin))
        .catch(err => console.error('Error checking PIN:', err));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      alert('Please enter a valid name');
      return;
    }

    // PIN validation
    if (pinData.newPin || pinData.confirmPin) {
      if (!/^\d{4}$/.test(pinData.newPin)) {
        alert('PIN must be exactly 4 digits');
        return;
      }
      if (pinData.newPin !== pinData.confirmPin) {
        alert('PINs do not match');
        return;
      }
      if (hasExistingPin && !pinData.currentPin) {
        alert('Please enter your current PIN to change it');
        return;
      }
    }

    const dataToSave = {
      ...formData,
      name: trimmedName
    };
    
    // Include PIN data if provided
    if (pinData.newPin) {
      dataToSave.pin = pinData.newPin;
      if (hasExistingPin) {
        dataToSave.currentPin = pinData.currentPin;
      }
    }

    if (user) {
      dataToSave.id = user.id;
    }
    
    try {
      await onSave(dataToSave);
    } catch (error) {
      if (error.message.includes('Current PIN is incorrect')) {
        alert('Current PIN is incorrect');
      } else {
        alert('Error saving user: ' + error.message);
      }
    }
  };

  const handleDelete = () => {
    onDelete(user.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="user-form-container">
      <div className="form-header">
        <h2>{user ? 'Edit User' : 'New User'}</h2>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>
      
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Enter name"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <div className="color-picker">
            {predefinedColors.map(color => (
              <button
                key={color}
                type="button"
                className={`color-option ${formData.color === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setFormData({ ...formData, color })}
              />
            ))}
          </div>
        </div>

        {user && (
          <div className="pin-section">
            <h3>PIN Protection</h3>
            <p className="pin-description">
              Set a 4-digit PIN to protect your to-dos from being edited by others.
            </p>
            
            {hasExistingPin && (
              <div className="form-group">
                <label>Current PIN *</label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength="4"
                  value={pinData.currentPin}
                  onChange={(e) => setPinData({ ...pinData, currentPin: e.target.value.replace(/\D/g, '') })}
                  placeholder="Enter current PIN"
                />
              </div>
            )}
            
            <div className="form-group">
              <label>New PIN {!hasExistingPin && '(optional)'}</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="\d{4}"
                maxLength="4"
                value={pinData.newPin}
                onChange={(e) => setPinData({ ...pinData, newPin: e.target.value.replace(/\D/g, '') })}
                placeholder="Enter 4-digit PIN"
              />
            </div>
            
            <div className="form-group">
              <label>Confirm New PIN</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="\d{4}"
                maxLength="4"
                value={pinData.confirmPin}
                onChange={(e) => setPinData({ ...pinData, confirmPin: e.target.value.replace(/\D/g, '') })}
                placeholder="Confirm 4-digit PIN"
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          {user && (
            <button 
              type="button" 
              className="delete-btn" 
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete User
            </button>
          )}
          <div className="action-buttons">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </div>
      </form>

      {showDeleteConfirm && (
        <div className="confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete User?</h3>
            <p>Are you sure you want to delete <strong>{user.name}</strong>?</p>
            <p className="warning">All to-dos for this user will also be deleted.</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserForm;
