import { useState } from 'react';
import './PINEntry.css';

function PINEntry({ userName, action = 'edit', onVerify, onCancel }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }
    onVerify(pin);
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPin(value);
    setError('');
  };

  const actionText = action === 'delete' ? 'delete' : 'edit';

  return (
    <div className="pin-entry-overlay" onClick={onCancel}>
      <div className="pin-entry-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="pin-entry-header">
          <h3>Enter PIN</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <p className="pin-entry-message">
          Enter <strong>{userName}'s</strong> PIN to {actionText} this to-do
        </p>

        <form onSubmit={handleSubmit}>
          <div className="pin-input-container">
            <input
              type="password"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength="4"
              value={pin}
              onChange={handlePinChange}
              placeholder="••••"
              autoFocus
              className="pin-input"
            />
          </div>

          {error && <p className="pin-error">{error}</p>}

          <div className="pin-entry-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="verify-btn">
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PINEntry;
