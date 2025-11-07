import './UserSelector.css';

function UserSelector({ users, currentUser, onSelectUser, onAddUser, onSelectOpenList, isOpenListSelected }) {
  return (
    <div className="user-selector">
      <button 
        className={`user-button open-list-button ${isOpenListSelected ? 'active' : ''}`}
        onClick={onSelectOpenList}
      >
        <div className="user-name">Open List</div>
      </button>
      {users.map(user => (
        <button
          key={user.id}
          className={`user-button ${currentUser?.id === user.id ? 'active' : ''}`}
          style={{
            backgroundColor: user.color,
            color: 'white'
          }}
          onClick={() => onSelectUser(user)}
        >
          <div className="user-name">{user.name}</div>
        </button>
      ))}
      <button className="user-add-button" onClick={onAddUser}>
        +
      </button>
    </div>
  );
}

export default UserSelector;
