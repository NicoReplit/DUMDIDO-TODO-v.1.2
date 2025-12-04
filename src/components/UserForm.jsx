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
      alert('Bitte einen gültigen Namen eingeben');
      return;
    }

    // PIN validation
    if (pinData.newPin || pinData.confirmPin) {
      if (!/^\d{4}$/.test(pinData.newPin)) {
        alert('PIN muss genau 4 Ziffern haben');
        return;
      }
      if (pinData.newPin !== pinData.confirmPin) {
        alert('PINs stimmen nicht überein');
        return;
      }
      if (hasExistingPin && !pinData.currentPin) {
        alert('Bitte aktuelle PIN eingeben um sie zu ändern');
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
        alert('Aktuelle PIN ist falsch');
      } else {
        alert('Fehler beim Speichern: ' + error.message);
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
        <h2>{user ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}</h2>
        <button className="close-btn" onClick={onCancel}>
          <img src="/Close.svg" alt="Close" className="close-icon" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Name eingeben"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Farbe</label>
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
            <h3>PIN-Schutz</h3>
            <p className="pin-description">
              Setze eine 4-stellige PIN, um deine Aufgaben vor Bearbeitung durch andere zu schützen.
            </p>
            
            {hasExistingPin && (
              <div className="form-group">
                <label>Aktuelle PIN *</label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength="4"
                  value={pinData.currentPin}
                  onChange={(e) => setPinData({ ...pinData, currentPin: e.target.value.replace(/\D/g, '') })}
                  placeholder="Aktuelle PIN eingeben"
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Neue PIN {!hasExistingPin && '(optional)'}</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="\d{4}"
                maxLength="4"
                value={pinData.newPin}
                onChange={(e) => setPinData({ ...pinData, newPin: e.target.value.replace(/\D/g, '') })}
                placeholder="4-stellige PIN eingeben"
              />
            </div>
            
            <div className="form-group">
              <label>Neue PIN bestätigen</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="\d{4}"
                maxLength="4"
                value={pinData.confirmPin}
                onChange={(e) => setPinData({ ...pinData, confirmPin: e.target.value.replace(/\D/g, '') })}
                placeholder="4-stellige PIN bestätigen"
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
              Benutzer löschen
            </button>
          )}
          <div className="action-buttons">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Abbrechen
            </button>
            <button type="submit" className="save-btn">
              Speichern
            </button>
          </div>
        </div>
      </form>

      {showDeleteConfirm && (
        <div className="confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Benutzer löschen?</h3>
            <p>Möchtest du <strong>{user.name}</strong> wirklich löschen?</p>
            <p className="warning">Alle Aufgaben dieses Benutzers werden ebenfalls gelöscht.</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                Abbrechen
              </button>
              <button className="confirm-delete-btn" onClick={handleDelete}>
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserForm;
