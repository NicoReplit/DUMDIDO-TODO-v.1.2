import './UserSelectionModal.css';

function UserSelectionModal({ users, taskTitle, onSelect, onCancel }) {
  return (
    <div className="user-selection-overlay" onClick={onCancel}>
      <div className="user-selection-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="user-selection-header">
          <h3>Who's doing this task?</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <p className="task-title-display">
          <strong>{taskTitle}</strong>
        </p>

        <p className="selection-prompt">Select your name to claim this task and earn bonus points!</p>

        <div className="user-selection-grid">
          {users.map(user => (
            <button
              key={user.id}
              className="user-select-btn"
              style={{ borderColor: user.color, color: user.color }}
              onClick={() => onSelect(user)}
            >
              <div className="user-name">{user.name}</div>
              <div className="user-stats">
                {user.total_points} pts ⭐{user.super_points}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserSelectionModal;
