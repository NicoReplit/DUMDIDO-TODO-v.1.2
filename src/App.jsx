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
import ProgressBar from './components/ProgressBar';
import RedMenu from './components/RedMenu';
import BlueCircle from './components/BlueCircle';
import ZigZag from './components/ZigZag';
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
  const [globalPin, setGlobalPin] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchOpenTodos();
    fetchGlobalSettings();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTodos();
    }
  }, [currentUser, currentDate]);
  
  useEffect(() => {
    fetchOpenTodos();
  }, [currentDate]);

  const fetchGlobalSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setGlobalPin(data.global_pin);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

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
        let payload;
        if (isOpenListSelected || todoData.is_open_list) {
          payload = { ...cleanedData, is_open_list: true };
        } else {
          payload = { ...cleanedData, user_id: currentUser.id };
        }
        await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setShowForm(false);
      setEditingTodo(null);
      if (isOpenListSelected) {
        fetchOpenTodos();
      } else {
        fetchTodos();
      }
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    // Check if global PIN is set
    try {
      const response = await fetch('/api/settings/has-pin');
      const data = await response.json();
      
      if (data.hasPin) {
        // Global PIN is set, show PIN entry dialog
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
    // Check if global PIN is set
    try {
      const response = await fetch('/api/settings/has-pin');
      const data = await response.json();
      
      if (data.hasPin) {
        // Global PIN is set, show PIN entry dialog
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
      const response = await fetch('/api/settings/verify-pin', {
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

  const handleUpdateUser = async (userId, userData) => {
    try {
      const payload = {
        name: userData.name,
        color: userData.color
      };
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }
      
      const updatedUser = await response.json();
      if (currentUser?.id === userId) {
        setCurrentUser(updatedUser);
      }
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error.message || 'Failed to update user. Please try again.');
      throw error;
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
        defaultOpenList={isOpenListSelected}
      />
    );
  }


  const handleSaveGlobalPin = async (newPin, currentPinInput) => {
    try {
      const payload = { global_pin: newPin };
      if (globalPin && currentPinInput) {
        payload.current_pin = currentPinInput;
      }
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }
      
      const data = await response.json();
      setGlobalPin(data.global_pin);
    } catch (error) {
      console.error('Error saving global PIN:', error);
      alert(error.message || 'Failed to save settings');
      throw error;
    }
  };

  return (
    <div className="app dumbledido-app">
      <header className="app-header dumbledido-header">
        <h1 className="dumbledido-logo">
          <span className="letter-d1">D</span>
          <span className="letter-u">U</span>
          <span className="letter-m">M</span>
          <span className="letter-b">B</span>
          <span className="letter-l">L</span>
          <span className="letter-e">E</span>
          <span className="letter-d2">D</span>
          <span className="letter-i">I</span>
          <span className="letter-d3">D</span>
          <span className="letter-o">O</span>
          <span className="letter-space"> </span>
          <span className="letter-t">T</span>
          <span className="letter-h">H</span>
          <span className="letter-e2">E</span>
          <span className="letter-space"> </span>
          <span className="letter-d4">D</span>
          <span className="letter-o2">O</span>
        </h1>
        <div className="header-content">
          <div className="header-subtitle">FAMILY TO-DO LIST</div>
          <div className="header-buttons">
            <input
              type="date"
              className="date-pill"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
            />
            {!isOpenListSelected && (
              <button className="add-user-button" onClick={() => setShowUserForm(true)}>
                +
              </button>
            )}
          </div>
        </div>
      </header>
      
      <UserSelector
        users={users}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onAddUser={() => setShowUserForm(true)}
        onSelectOpenList={handleSelectOpenList}
        isOpenListSelected={isOpenListSelected}
        onUpdateUser={handleUpdateUser}
      />

      {currentUser && !isOpenListSelected && (
        <ProgressBar points={currentUser.total_points || 0} maxPoints={1000} />
      )}

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

      <button className="add-button dumbledido-add-button" onClick={() => setShowForm(true)}>
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

      {selectedTodo && (
        <TodoDetail
          todo={selectedTodo}
          currentUser={currentUser}
          onClose={() => setSelectedTodo(null)}
          onUpdate={(updates) => handleUpdateTodo(selectedTodo.id, updates)}
          startTimer={startTimer}
          stopTimer={stopTimer}
          getTimerState={getTimerState}
        />
      )}

      <RedMenu 
        globalPin={globalPin}
        onSavePin={handleSaveGlobalPin}
      />
      <BlueCircle />
      
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5000
      }}>
        <ZigZag />
      </div>
      
      <button 
        className="left-red-pill" 
        onClick={async () => {
          if (!currentUser) {
            alert('Please select a user first!');
            return;
          }

          if (currentUser.super_points <= 0) {
            alert('No super points available! Super points are earned through completing tasks and streaks.');
            return;
          }

          if (!selectedTodo) {
            alert(`You have ${currentUser.super_points} super points available!\n\nSuper points can be used when completing a task to count it as "on-time" regardless of how long it took.\n\nOpen a task to use a super point.`);
            return;
          }

          if (selectedTodo.completed) {
            alert('This task is already completed!');
            return;
          }

          if (selectedTodo.super_point_used) {
            alert('This task already has a super point applied!');
            return;
          }

          if (window.confirm('Use 1 super point to complete this task on-time?')) {
            try {
              const response = await fetch(`/api/users/${currentUser.id}/use-super-point`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
              });
              
              if (!response.ok) {
                const error = await response.text();
                alert(`Failed to use super point: ${error}`);
                return;
              }
              
              const updatedUser = await response.json();
              
              const basePoints = selectedTodo.estimated_minutes || 0;
              
              await handleUpdateTodo(selectedTodo.id, {
                completed: true,
                super_point_used: true,
                points_earned: basePoints,
                remaining_seconds: 0,
                pause_used: false,
                actual_time_seconds: 0
              });
              
              setCurrentUser(updatedUser);
              setSelectedTodo(null);
              await fetchTodos();
              await fetchOpenTodos();
              await fetchUsers();
              
              alert('Super point used! ⭐ Task completed on-time!');
            } catch (error) {
              console.error('Error using super point:', error);
              alert('Failed to use super point. Please try again.');
            }
          }
        }}
      >
        <div className="left-red-pill-text">
          <div className="super-punkte-header">
            <span className="star-emoji">⭐</span>
            <span className="super-punkte-counter">{currentUser ? currentUser.super_points : 0}</span>
          </div>
          Super<br />Punkte
        </div>
      </button>
    </div>
  );
}

export default App;
