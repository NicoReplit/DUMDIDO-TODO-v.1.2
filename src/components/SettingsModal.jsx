import { useState } from 'react';
import './SettingsModal.css';

function SettingsModal({ onClose, globalPin, onSavePin }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [showChangePin, setShowChangePin] = useState(!!globalPin);

  const handleSave = async () => {
    if (showChangePin && globalPin && !currentPin) {
      alert('Please enter your current PIN');
      return;
    }

    if (pin && pin !== confirmPin) {
      alert('PINs do not match');
      return;
    }

    if (pin && pin.length !== 4) {
      alert('PIN must be 4 digits');
      return;
    }

    await onSavePin(pin, currentPin);
    onClose();
  };

  const handleRemovePin = async () => {
    if (confirm('Are you sure you want to remove the global PIN? All users will be unprotected.')) {
      await onSavePin(null, currentPin);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2>⚙️ Settings</h2>
        
        <div className="settings-section">
          <h3>🔴 Global PIN Protection</h3>
          <p className="settings-description">
            Set a PIN to protect all user tasks from editing or deletion.
          </p>

          {showChangePin && globalPin && (
            <div className="form-group">
              <label>Current PIN</label>
              <input
                type="password"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Enter current PIN"
                className="pin-input"
                maxLength="4"
                pattern="[0-9]*"
                inputMode="numeric"
              />
            </div>
          )}

          <div className="form-group">
            <label>{globalPin ? 'New PIN (4 digits)' : 'PIN (4 digits)'}</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Enter 4-digit PIN"
              className="pin-input"
              maxLength="4"
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>

          {pin && (
            <div className="form-group">
              <label>Confirm New PIN</label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Confirm PIN"
                className="pin-input"
                maxLength="4"
                pattern="[0-9]*"
                inputMode="numeric"
              />
            </div>
          )}
        </div>

        <div className="modal-actions">
          {globalPin && (
            <button className="btn-remove" onClick={handleRemovePin}>
              Remove PIN
            </button>
          )}
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

export default SettingsModal;
