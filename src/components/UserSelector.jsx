import './UserSelector.css';

function UserSelector({ users, currentUser, onSelectUser }) {
  return (
    <div className="user-selector">
      {users.map(user => (
        <button
          key={user.id}
          className={`user-button ${currentUser?.id === user.id ? 'active' : ''}`}
          style={{
            backgroundColor: currentUser?.id === user.id ? user.color : 'transparent',
            borderColor: user.color,
            color: currentUser?.id === user.id ? 'white' : user.color
          }}
          onClick={() => onSelectUser(user)}
        >
          {user.name}
        </button>
      ))}
    </div>
  );
}

export default UserSelector;
