import { useState, useEffect, useCallback } from 'react';
import AppTile from './components/AppTile';
import StandbyMode from './components/StandbyMode';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [apps, setApps] = useState([]);
  const [isStandby, setIsStandby] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeApp, setActiveApp] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [settings, setSettings] = useState({
    standbyEnabled: true,
    standbyTimeout: 5,
    slideshowEnabled: true,
    slideshowInterval: 10,
    imagesPath: '/home/pi/Pictures/slideshow'
  });

  const placeholderApps = [
    {
      id: 'calendar',
      name: 'Kalender',
      shortName: 'Kalender',
      icon: 'calendar',
      display: { primaryColor: '#0061EE' },
      comingSoon: true
    },
    {
      id: 'weather',
      name: 'Wetter',
      shortName: 'Wetter',
      icon: 'weather',
      display: { primaryColor: '#38D247' },
      comingSoon: true
    },
    {
      id: 'checklist',
      name: 'Checkliste',
      shortName: 'Liste',
      icon: 'checklist',
      display: { primaryColor: '#FF8A00' },
      comingSoon: true
    }
  ];

  useEffect(() => {
    async function fetchApps() {
      try {
        const response = await fetch('/api/apps');
        const discoveredApps = await response.json();
        
        const formattedApps = discoveredApps.map(app => ({
          id: app.id,
          name: app.name,
          shortName: app.shortName || app.name,
          icon: app.id.includes('todo') ? 'todo' : app.id,
          display: app.display,
          entry: app.entry,
          port: app.entry?.port,
          path: app.entry?.path || '/'
        }));
        
        setApps([...formattedApps, ...placeholderApps]);
      } catch (error) {
        console.error('Failed to fetch apps:', error);
        setApps(placeholderApps);
      }
    }
    fetchApps();
  }, []);

  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
    if (isStandby) {
      setIsStandby(false);
      setActiveApp(null);
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
    if (!activeApp) return;
    
    let lastFocusCheck = Date.now();
    const focusInterval = setInterval(() => {
      if (document.activeElement?.tagName === 'IFRAME') {
        lastFocusCheck = Date.now();
        setLastActivity(Date.now());
      }
    }, 2000);

    const handleBlur = () => {
      if (document.activeElement?.tagName === 'IFRAME') {
        setLastActivity(Date.now());
      }
    };
    window.addEventListener('blur', handleBlur);

    return () => {
      clearInterval(focusInterval);
      window.removeEventListener('blur', handleBlur);
    };
  }, [activeApp]);

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
      setActiveApp(app);
    }
  };

  const handleCloseApp = () => {
    setActiveApp(null);
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

  const handleSwipeDown = (e) => {
    const touch = e.changedTouches[0];
    const startY = e.target.dataset.startY;
    if (startY && touch.clientY - startY > 100 && startY < 50) {
      setActiveApp(null);
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    e.target.dataset.startY = touch.clientY;
  };

  if (activeApp) {
    return (
      <div 
        className="app-viewer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleSwipeDown}
      >
        <div className="swipe-indicator">
          <div className="swipe-bar"></div>
        </div>
        <iframe 
          src={`http://127.0.0.1:${activeApp.port}${activeApp.path || '/'}`}
          className="app-iframe"
          title={activeApp.name}
          allow="fullscreen"
        />
      </div>
    );
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
