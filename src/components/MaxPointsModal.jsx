import { useState, useEffect } from 'react';
import './MaxPointsModal.css';

function MaxPointsModal({ globalPin, currentMaxPoints = 1000, onSave, onClose }) {
  const [pin, setPin] = useState('');
  const [verifiedPin, setVerifiedPin] = useState(''); // Store the verified PIN separately
  const [maxPoints, setMaxPoints] = useState(currentMaxPoints);
  const [pinVerified, setPinVerified] = useState(!globalPin);

  // Reset state when modal is opened
  useEffect(() => {
    setPin('');
    setVerifiedPin('');
    setMaxPoints(currentMaxPoints);
    setPinVerified(!globalPin);
  }, [globalPin, currentMaxPoints]);

  const handleVerifyPin = async () => {
    if (!pin || pin.length !== 4) {
      alert('Bitte 4-stellige PIN eingeben');
      return;
    }

    try {
      const response = await fetch('/api/settings/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await response.json();
      
      if (data.valid) {
        setVerifiedPin(pin); // Store the verified PIN in separate state
        setPin(''); // Clear the input PIN for security
        setPinVerified(true);
      } else {
        alert('Falsche PIN');
        setPin('');
      }
    } catch (error) {
      alert('Fehler beim Überprüfen der PIN');
    }
  };

  const handleSave = async () => {
    if (maxPoints < 100 || maxPoints > 10000) {
      alert('Max Punkte müssen zwischen 100 und 10000 liegen');
      return;
    }

    // If PIN is required but not verified, don't proceed
    if (globalPin && !verifiedPin) {
      alert('PIN-Verifizierung erforderlich');
      return;
    }

    try {
      // Pass verifiedPin only if we actually verified one (when globalPin exists)
      await onSave(maxPoints, globalPin ? verifiedPin : '');
      onClose();
    } catch (error) {
      // Error already shown by handleSaveMaxPoints
      console.error('Failed to save max points:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-points-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Max Punkte bearbeiten</h2>
        
        {!pinVerified ? (
          <>
            <p>Gib die globale PIN ein, um die maximalen Punkte zu ändern:</p>
            <div className="form-group">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="PIN eingeben"
                maxLength="4"
                pattern="[0-9]*"
                inputMode="numeric"
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={onClose}>
                Abbrechen
              </button>
              <button className="btn-save" onClick={handleVerifyPin}>
                Bestätigen
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Maximale Punkte</label>
              <input
                type="number"
                value={maxPoints}
                onChange={(e) => setMaxPoints(parseInt(e.target.value) || 0)}
                min="100"
                max="10000"
                step="100"
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={onClose}>
                Abbrechen
              </button>
              <button className="btn-save" onClick={handleSave}>
                Speichern
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MaxPointsModal;
