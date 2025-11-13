import { useState } from 'react';
import './PINChangeModal.css';

function PINChangeModal({ globalPin, onSave, onClose }) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSubmit = async () => {
    if (globalPin && !currentPin) {
      alert('Bitte aktuelle PIN eingeben');
      return;
    }

    if (!newPin) {
      alert('Bitte neue PIN eingeben');
      return;
    }

    if (newPin !== confirmPin) {
      alert('PINs stimmen nicht überein');
      return;
    }

    if (newPin.length !== 4) {
      alert('PIN muss 4 Ziffern haben');
      return;
    }

    await onSave(newPin, currentPin);
    onClose();
  };

  const handleRemove = async () => {
    if (!currentPin || currentPin.length !== 4) {
      alert('Bitte aktuelle PIN eingeben um sie zu entfernen');
      return;
    }
    if (window.confirm('Möchtest du die globale PIN wirklich entfernen?')) {
      await onSave(null, currentPin);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content pin-change-modal" onClick={(e) => e.stopPropagation()}>
        <h2>PIN ändern</h2>
        
        {globalPin && (
          <div className="form-group">
            <label>Aktuelle PIN</label>
            <input
              type="password"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Aktuelle PIN"
              maxLength="4"
              pattern="[0-9]*"
              inputMode="numeric"
              autoFocus
            />
          </div>
        )}

        <div className="form-group">
          <label>Neue PIN</label>
          <input
            type="password"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="4-stellige PIN"
            maxLength="4"
            pattern="[0-9]*"
            inputMode="numeric"
            autoFocus={!globalPin}
          />
        </div>

        <div className="form-group">
          <label>PIN bestätigen</label>
          <input
            type="password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="PIN wiederholen"
            maxLength="4"
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>

        <div className="modal-actions">
          {globalPin && (
            <button className="btn-remove" onClick={handleRemove}>
              PIN entfernen
            </button>
          )}
          <button className="btn-cancel" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

export default PINChangeModal;
