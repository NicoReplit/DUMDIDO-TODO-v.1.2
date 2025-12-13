import { useState, useEffect, useCallback } from 'react';
import AppTile from './components/AppTile';
import StandbyMode from './components/StandbyMode';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [apps, setApps] = useState([]);
  const [isStandby, setIsStandby] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [settings, setSettings] = useState({
    standbyEnabled: true,
    standbyTimeout: 5,
    slideshowEnabled: true,
    slideshowInterval: 10,
    imagesPath: '/home/pi/Pictures/slideshow'
  });

  const demoApps = [
    {
      id: 'family-todo',
      name: 'DUMBDIDO TODO',
      shortName: 'Todo',
      icon: 'todo',
      backgroundColor: '#FECE00',
      primaryColor: '#E866C8',
      port: 5001,
      path: '/'
    },
    {
      id: 'calendar',
      name: 'Kalender',
      shortName: 'Kalender',
      icon: 'calendar',
      backgroundColor: '#0061EE',
      primaryColor: '#0061EE',
      port: null,
      path: null,
      comingSoon: true
    },
    {
      id: 'weather',
      name: 'Wetter',
      shortName: 'Wetter',
      icon: 'weather',
      backgroundColor: '#38D247',
      primaryColor: '#38D247',
      port: null,
      path: null,
      comingSoon: true
    },
    {
      id: 'checklist',
      name: 'Checkliste',
      shortName: 'Liste',
      icon: 'checklist',
      backgroundColor: '#FF8A00',
      primaryColor: '#FF8A00',
      port: null,
      path: null,
      comingSoon: true
    }
  ];

  useEffect(() => {
    setApps(demoApps);
  }, []);

  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
    if (isStandby) {
      setIsStandby(false);
    }
  }, [isStandby]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'touchmove'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity]);

  useEffect(() => {
    if (!settings.standbyEnabled) return;

    const checkStandby = setInterval(() => {
      const inactiveTime = (Date.now() - lastActivity) / 1000 / 60;
      if (inactiveTime >= settings.standbyTimeout && !isStandby && !showSettings) {
        setIsStandby(true);
      }
    }, 1000);

    return () => clearInterval(checkStandby);
  }, [lastActivity, settings.standbyEnabled, settings.standbyTimeout, isStandby, showSettings]);

  const handleAppClick = (app) => {
    if (app.comingSoon) {
      return;
    }
    if (app.port) {
      window.location.href = `http://${window.location.hostname}:${app.port}${app.path}`;
    }
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('dashboardSettings', JSON.stringify(newSettings));
  };

  useEffect(() => {
    const saved = localStorage.getItem('dashboardSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  if (isStandby) {
    return <StandbyMode settings={settings} onWake={() => setIsStandby(false)} />;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          <span className="title-family">FAMILY</span>
          <span className="title-plan">PLAN</span>
        </h1>
        <button className="settings-btn" onClick={() => setShowSettings(true)}>
          <div className="settings-icon">
            <div className="gear"></div>
          </div>
        </button>
      </header>

      <main className="apps-grid">
        {apps.map((app) => (
          <AppTile 
            key={app.id} 
            app={app} 
            onClick={() => handleAppClick(app)}
          />
        ))}
      </main>

      {showSettings && (
        <Settings 
          settings={settings}
          onChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
