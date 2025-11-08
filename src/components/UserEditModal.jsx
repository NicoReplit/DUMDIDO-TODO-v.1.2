import { useState } from 'react';
import './UserEditModal.css';

const AVAILABLE_COLORS = [
  '#FECE00', // Yellow
  '#0061EE', // Blue
  '#FF006E', // Pink
  '#EE4100', // Coral/Red
  '#38D247', // Green
  '#FEBA00', // Orange
  '#FF77B9', // Light Pink
  '#EE00AE', // Magenta
  '#10B981', // Emerald
  '#EC4899', // Fuchsia
  '#3B82F6', // Sky Blue
  '#F59E0B', // Amber
];

function UserEditModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user?.name || '');
  const [color, setColor] = useState(user?.color || AVAILABLE_COLORS[0]);

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
