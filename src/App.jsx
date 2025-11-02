import { useState, useEffect } from 'react';
import UserSelector from './components/UserSelector';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import TodoDetail from './components/TodoDetail';
import UserForm from './components/UserForm';
import WeekCalendar from './components/WeekCalendar';
import PINEntry from './components/PINEntry';
import OpenList from './components/OpenList';
import UserSelectionModal from './components/UserSelectionModal';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [openTodos, setOpenTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [runningTimers, setRunningTimers] = useState({});
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pendingEditTodo, setPendingEditTodo] = useState(null);
  const [pendingDeleteTodoId, setPendingDeleteTodoId] = useState(null);
  const [pinAction, setPinAction] = useState(null); // 'edit' or 'delete'
  const [showUserSelectionModal, setShowUserSelectionModal] = useState(false);
  const [pendingClaimTask, setPendingClaimTask] = useState(null);
  const [isOpenListSelected, setIsOpenListSelected] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchOpenTodos();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTodos();
    }
  }, [currentUser, currentDate]);
  
  useEffect(() => {
    fetchOpenTodos();
  }, [currentDate]);

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

  const fetchOpenTodos = async () => {
    try {
      const response = await fetch('/api/open-list');
      const data = await response.json();
      setOpenTodos(data);
    } catch (error) {
      console.error('Error fetching open list:', error);
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
    // Check if user has a PIN set
    try {
      const response = await fetch(`/api/users/${currentUser.id}/has-pin`);
      const data = await response.json();
      
      if (data.hasPin) {
        // User has PIN, show PIN entry dialog
        setPendingDeleteTodoId(id);
        setPinAction('delete');
        setShowPinEntry(true);
      } else {
        // No PIN, proceed directly
        await fetch(`/api/todos/${id}`, { method: 'DELETE' });
        fetchTodos();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditTodo = async (todo) => {
    // Check if user has a PIN set
    try {
      const response = await fetch(`/api/users/${currentUser.id}/has-pin`);
      const data = await response.json();
      
      if (data.hasPin) {
        // User has PIN, show PIN entry dialog
        setPendingEditTodo(todo);
        setPinAction('edit');
        setShowPinEntry(true);
      } else {
        // No PIN, proceed directly
        setEditingTodo(todo);
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error checking PIN:', error);
      // On error, allow editing (fail open)
      setEditingTodo(todo);
      setShowForm(true);
    }
  };

  const handlePinVerify = async (pin) => {
    try {
      const response = await fetch(`/api/users/${currentUser.id}/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await response.json();
      
      if (data.valid) {
        // PIN correct, proceed with action
        setShowPinEntry(false);
        
        if (pinAction === 'edit') {
          // Proceed with editing
          setEditingTodo(pendingEditTodo);
          setShowForm(true);
          setPendingEditTodo(null);
        } else if (pinAction === 'delete') {
          // Proceed with deleting
          await fetch(`/api/todos/${pendingDeleteTodoId}`, { method: 'DELETE' });
          fetchTodos();
          setPendingDeleteTodoId(null);
        }
        
        setPinAction(null);
      } else {
        // PIN incorrect
        alert('Incorrect PIN. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      alert('Error verifying PIN. Please try again.');
    }
  };

  const handlePinCancel = () => {
    setShowPinEntry(false);
    setPendingEditTodo(null);
    setPendingDeleteTodoId(null);
    setPinAction(null);
  };

  const handleUpdateTodo = async (id, updates) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => todo.id === id ? { ...todo, ...updates } : todo)
    );
    
    try {
      const updatesWithDate = {
        ...updates,
        completion_date: currentDate
      };
      
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatesWithDate)
      });
      const updatedTodo = await response.json();
      
      setTodos(prevTodos => 
        prevTodos.map(todo => todo.id === id ? updatedTodo : todo)
      );
      
      if (updates.completed || updates.super_point_used) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      fetchTodos();
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        const payload = {
          name: userData.name,
          color: userData.color
        };
        // Include PIN fields if provided
        if (userData.pin !== undefined) {
          payload.pin = userData.pin;
        }
        if (userData.currentPin !== undefined) {
          payload.currentPin = userData.currentPin;
        }
        
        const response = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update user');
        }
        const updatedUser = await response.json();
        if (currentUser?.id === editingUser.id) {
          setCurrentUser(updatedUser);
        }
      } else {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: userData.name, color: userData.color })
        });
        if (!response.ok) {
          throw new Error('Failed to create user');
        }
      }
      await fetchUsers();
      setShowUserForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error; // Re-throw so UserForm can handle it
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      const updatedUsersResponse = await fetch('/api/users');
      const updatedUsers = await updatedUsersResponse.json();
      setUsers(updatedUsers);
      
      if (currentUser?.id === userId) {
        setCurrentUser(updatedUsers.length > 0 ? updatedUsers[0] : null);
      }
      setShowUserForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const startTimer = (todoId, initialRemaining, initialElapsed) => {
    if (runningTimers[todoId]) return;
    
    const timer = {
      todoId,
      timeRemaining: initialRemaining,
      elapsedTime: initialElapsed,
      interval: setInterval(() => {
        setRunningTimers(prev => {
          const current = prev[todoId];
          if (!current) return prev;
          
          const newElapsed = current.elapsedTime + 1;
          const newRemaining = current.timeRemaining - 1;
          
          handleUpdateTodo(todoId, {
            remaining_seconds: newRemaining,
            actual_time_seconds: newElapsed
          });
          
          return {
            ...prev,
            [todoId]: {
              ...current,
              timeRemaining: newRemaining,
              elapsedTime: newElapsed
            }
          };
        });
      }, 1000)
    };
    
    setRunningTimers(prev => ({ ...prev, [todoId]: timer }));
  };

  const stopTimer = (todoId) => {
    const timer = runningTimers[todoId];
    if (timer && timer.interval) {
      clearInterval(timer.interval);
      setRunningTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[todoId];
        return newTimers;
      });
    }
  };

  const getTimerState = (todoId) => {
    return runningTimers[todoId] || null;
  };

  const handleSelectOpenTask = (task) => {
    setPendingClaimTask(task);
    setShowUserSelectionModal(true);
  };

  const handleClaimTask = async (user) => {
    try {
      await fetch(`/api/todos/${pendingClaimTask.id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      
      await fetchOpenTodos();
      await fetchUsers();
      
      const claimedTask = { ...pendingClaimTask, claimed_by_user_id: user.id };
      setShowUserSelectionModal(false);
      setCurrentUser(user);
      setSelectedTodo(claimedTask);
      setPendingClaimTask(null);
    } catch (error) {
      console.error('Error claiming task:', error);
      alert('Failed to claim task. Please try again.');
    }
  };

  const handleCancelClaim = () => {
    setShowUserSelectionModal(false);
    setPendingClaimTask(null);
  };

  const handleSelectOpenList = () => {
    setIsOpenListSelected(true);
    setCurrentUser(null);
  };

  const handleSelectUser = (user) => {
    setIsOpenListSelected(false);
    setCurrentUser(user);
  };

  if (selectedTodo) {
    return (
      <TodoDetail
        todo={selectedTodo}
        currentUser={currentUser}
        onClose={() => setSelectedTodo(null)}
        onUpdate={(updates) => handleUpdateTodo(selectedTodo.id, updates)}
        startTimer={startTimer}
        stopTimer={stopTimer}
        getTimerState={getTimerState}
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
          {!isOpenListSelected && (
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="date-picker"
            />
          )}
          {currentUser && !isOpenListSelected && (
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
        onSelectUser={handleSelectUser}
        onAddUser={() => setShowUserForm(true)}
        onSelectOpenList={handleSelectOpenList}
        isOpenListSelected={isOpenListSelected}
      />

      {isOpenListSelected ? (
        <div className="open-list-view">
          <h2 className="section-title">Shared Family Tasks</h2>
          <p className="section-description">Claim any task for +10 bonus points! 🎁</p>
          <TodoList
            todos={openTodos}
            onEdit={() => {}}
            onDelete={() => {}}
            onSelect={handleSelectOpenTask}
            runningTimers={runningTimers}
            isOpenList={true}
          />
        </div>
      ) : currentUser && (
        <>
          <WeekCalendar userId={currentUser.id} selectedDate={currentDate} />
          
          <TodoList
            todos={todos}
            onEdit={handleEditTodo}
            onDelete={handleDeleteTodo}
            onSelect={setSelectedTodo}
            runningTimers={runningTimers}
          />
        </>
      )}

      <button className="add-button" onClick={() => setShowForm(true)}>
        +
      </button>

      {showPinEntry && currentUser && (
        <PINEntry
          userName={currentUser.name}
          action={pinAction}
          onVerify={handlePinVerify}
          onCancel={handlePinCancel}
        />
      )}

      {showUserSelectionModal && pendingClaimTask && (
        <UserSelectionModal
          users={users}
          taskTitle={pendingClaimTask.title}
          onSelect={handleClaimTask}
          onCancel={handleCancelClaim}
        />
      )}
    </div>
  );
}

export default App;
