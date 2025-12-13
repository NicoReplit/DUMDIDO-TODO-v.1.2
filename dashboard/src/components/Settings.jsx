import './Settings.css';

function Settings({ settings, onChange, onClose }) {
  const handleChange = (key, value) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Einstellungen</h2>
          <button className="close-btn" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>Standby Modus</h3>
            
            <label className="setting-row">
              <span>Standby aktivieren</span>
              <input
                type="checkbox"
                checked={settings.standbyEnabled}
                onChange={(e) => handleChange('standbyEnabled', e.target.checked)}
              />
              <span className="toggle"></span>
            </label>

            {settings.standbyEnabled && (
              <>
                <label className="setting-row">
                  <span>Inaktivität (Minuten)</span>
                  <select
                    value={settings.standbyTimeout}
                    onChange={(e) => handleChange('standbyTimeout', Number(e.target.value))}
                  >
                    <option value={1}>1 Minute</option>
                    <option value={2}>2 Minuten</option>
                    <option value={5}>5 Minuten</option>
                    <option value={10}>10 Minuten</option>
                    <option value={15}>15 Minuten</option>
                    <option value={30}>30 Minuten</option>
                  </select>
                </label>

                <label className="setting-row">
                  <span>Diashow aktivieren</span>
                  <input
                    type="checkbox"
                    checked={settings.slideshowEnabled}
                    onChange={(e) => handleChange('slideshowEnabled', e.target.checked)}
                  />
                  <span className="toggle"></span>
                </label>

                {settings.slideshowEnabled && (
                  <label className="setting-row">
                    <span>Bildwechsel (Sekunden)</span>
                    <select
                      value={settings.slideshowInterval}
                      onChange={(e) => handleChange('slideshowInterval', Number(e.target.value))}
                    >
                      <option value={5}>5 Sekunden</option>
                      <option value={10}>10 Sekunden</option>
                      <option value={15}>15 Sekunden</option>
                      <option value={30}>30 Sekunden</option>
                      <option value={60}>1 Minute</option>
                    </select>
                  </label>
                )}
              </>
            )}
          </div>

          <div className="settings-section">
            <h3>Bilder Ordner</h3>
            <div className="path-info">
              <p>Lege Bilder in diesen Ordner auf dem Raspberry Pi:</p>
              <code>{settings.imagesPath}</code>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="save-btn" onClick={onClose}>
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
