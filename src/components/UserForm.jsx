import { useState } from 'react';
import './UserForm.css';

function UserForm({ user, onSave, onCancel, onDelete }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    color: user?.color || '#3B82F6'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      alert('Please enter a valid name');
      return;
    }
    const dataToSave = {
      ...formData,
      name: trimmedName
    };
    if (user) {
      dataToSave.id = user.id;
    }
    onSave(dataToSave);
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
