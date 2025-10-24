import { useState, useEffect } from 'react';
import UserSelector from './components/UserSelector';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import TodoDetail from './components/TodoDetail';
import UserForm from './components/UserForm';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTodos();
    }
  }, [currentUser, currentDate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
      if (data.length > 0 && !currentUser) {
        setCurrentUser(data[0]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch(`/api/todos?user_id=${currentUser.id}&date=${currentDate}`);
      const data = await response.json();
      
      const filteredTodos = data.filter(todo => {
        if (todo.specific_date) {
          const todoDate = todo.specific_date.split('T')[0];
          return todoDate === currentDate;
        }
        if (todo.recurrence_type === 'daily') {
          return true;
        }
        if (todo.recurrence_type === 'weekly' && todo.recurrence_days) {
          const todayDay = new Date(currentDate).getDay();
          const days = JSON.parse(todo.recurrence_days);
          return days.includes(todayDay);
        }
        return false;
      });
      
      setTodos(filteredTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleSaveTodo = async (todoData) => {
    try {
      const cleanedData = {
        ...todoData,
        estimated_minutes: todoData.estimated_minutes || null,
        specific_date: todoData.specific_date || null,
        recurrence_type: todoData.recurrence_type || null,
        recurrence_days: todoData.recurrence_days || null
      };
      
      if (editingTodo) {
        await fetch(`/api/todos/${editingTodo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanedData)
        });
      } else {
        const payload = { ...cleanedData, user_id: currentUser.id };
        await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setShowForm(false);
      setEditingTodo(null);
      fetchTodos();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleUpdateTodo = async (id, updates) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => todo.id === id ? { ...todo, ...updates } : todo)
    );
    
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updatedTodo = await response.json();
      
      setTodos(prevTodos => 
        prevTodos.map(todo => todo.id === id ? updatedTodo : todo)
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      fetchTodos();
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        const response = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
        if (currentUser?.id === editingUser.id) {
          setCurrentUser(updatedUser);
        }
      } else {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        const newUser = await response.json();
        setUsers([...users, newUser]);
      }
      setShowUserForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== userId));
      if (currentUser?.id === userId) {
        setCurrentUser(users.find(u => u.id !== userId) || null);
      }
      setShowUserForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (selectedTodo) {
    return (
      <TodoDetail
        todo={selectedTodo}
        onClose={() => setSelectedTodo(null)}
        onUpdate={(updates) => handleUpdateTodo(selectedTodo.id, updates)}
      />
    );
  }

  if (showUserForm) {
    return (
      <UserForm
        user={editingUser}
        onSave={handleSaveUser}
        onCancel={() => {
          setShowUserForm(false);
          setEditingUser(null);
        }}
        onDelete={handleDeleteUser}
      />
    );
  }

  if (showForm) {
    return (
      <TodoForm
        todo={editingTodo}
        onSave={handleSaveTodo}
        onCancel={() => {
          setShowForm(false);
          setEditingTodo(null);
        }}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Family To-Do</h1>
        <div className="header-controls">
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className="date-picker"
          />
          {currentUser && (
            <button 
              className="edit-user-button" 
              onClick={() => {
                setEditingUser(currentUser);
                setShowUserForm(true);
              }}
              title="Edit user"
            >
              ✏️
            </button>
          )}
        </div>
      </header>
      
      <UserSelector
        users={users}
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        onAddUser={() => setShowUserForm(true)}
      />

      <TodoList
        todos={todos}
        onEdit={handleEditTodo}
        onDelete={handleDeleteTodo}
        onSelect={setSelectedTodo}
      />

      <button className="add-button" onClick={() => setShowForm(true)}>
        +
      </button>
    </div>
  );
}

export default App;
