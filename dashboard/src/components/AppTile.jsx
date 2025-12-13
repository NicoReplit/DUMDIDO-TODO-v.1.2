import './AppTile.css';

const blobShapes = {
  todo: {
    color: '#E866C8',
    shape: 'blob1'
  },
  calendar: {
    color: '#0061EE',
    shape: 'blob2'
  },
  weather: {
    color: '#38D247',
    shape: 'blob3'
  },
  checklist: {
    color: '#FF8A00',
    shape: 'blob4'
  }
};

function AppTile({ app, onClick }) {
  const blob = blobShapes[app.icon] || blobShapes.todo;

  return (
    <div 
      className={`app-tile ${app.comingSoon ? 'coming-soon' : ''}`}
      onClick={onClick}
    >
      <div className={`blob-character ${blob.shape}`} style={{ backgroundColor: blob.color }}>
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
