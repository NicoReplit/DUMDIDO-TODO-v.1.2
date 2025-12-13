import './AppTile.css';

const shapeMap = {
  'todo': 'blob1',
  'family-todo': 'blob1',
  'calendar': 'blob2',
  'weather': 'blob3',
  'checklist': 'blob4'
};

const defaultColors = {
  'todo': '#E866C8',
  'family-todo': '#E866C8',
  'calendar': '#0061EE',
  'weather': '#38D247',
  'checklist': '#FF8A00'
};

function AppTile({ app, onClick }) {
  const shape = shapeMap[app.icon] || shapeMap[app.id] || 'blob1';
  const color = app.display?.primaryColor || defaultColors[app.icon] || defaultColors[app.id] || '#E866C8';

  return (
    <div 
      className={`app-tile ${app.comingSoon ? 'coming-soon' : ''}`}
      onClick={onClick}
    >
      <div className={`blob-character ${shape}`} style={{ backgroundColor: color }}>
        <div className="blob-eyes">
          <div className="blob-eye left">
            <div className="pupil"></div>
          </div>
          <div className="blob-eye right">
            <div className="pupil"></div>
          </div>
        </div>
      </div>
      <span className="app-name">{app.shortName}</span>
      {app.comingSoon && <span className="coming-soon-badge">Bald</span>}
    </div>
  );
}

export default AppTile;
