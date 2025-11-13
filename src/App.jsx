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
import BlueMenu from './components/BlueMenu';
import CelebrationMenu from './components/CelebrationMenu';
import QuarterCircle from './components/QuarterCircle';
import ZigZag from './components/ZigZag';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
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
  const [doneCallback, setDoneCallback] = useState(null);
  const [pauseCallback, setPauseCallback] = useState(null);
  const [celebrationData, setCelebrationData] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [deleteScope, setDeleteScope] = useState(null); // 'single' or 'series'
  const [moonAnimating, setMoonAnimating] = useState(false);

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

  useEffect(() => {
    if (celebrationData) {
      setMoonAnimating(true);
      const timer = setTimeout(() => {
        setMoonAnimating(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [celebrationData]);

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

  const fetchUsers = async ({ preserveSelection = false } = {}) => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
      
      // Rehydrate currentUser if one is already selected
      if (currentUser) {
        const updatedUser = data.find(u => u.id === currentUser.id);
        if (updatedUser) {
          setCurrentUser(updatedUser);
        }
      }
      // Auto-select first user only on initial load (not in Open List mode, not when preserving)
      else if (data.length > 0 && !isOpenListSelected && !preserveSelection) {
        setCurrentUser(data[0]);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const fetchTodos = async (user = null) => {
    try {
      // Use provided user or fall back to currentUser
      const targetUser = user || currentUser;
      if (!targetUser) return; // No-op if no user available
      
      const response = await fetch(`/api/todos?user_id=${targetUser.id}&date=${currentDate}`);
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
          payload = { ...cleanedData, is_open_list: true, user_id: null };
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
    // Find the todo to check if it's recurring
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    const isRecurring = todo.recurrence_type && todo.recurrence_type !== 'once';
    
    if (isRecurring) {
      // Show confirmation modal for recurring todos
      setTodoToDelete(todo);
      setShowDeleteConfirmation(true);
    } else {
      // Non-recurring todo - proceed with PIN check directly
      try {
        const response = await fetch('/api/settings/has-pin');
        const data = await response.json();
        
        if (data.hasPin) {
          // Global PIN is set, show PIN entry dialog
          setPendingDeleteTodoId(id);
          setDeleteScope(null); // No scope for non-recurring todos
          setPinAction('delete');
          setShowPinEntry(true);
        } else {
          // No PIN, proceed directly - delete without scope
          await fetch(`/api/todos/${id}`, { method: 'DELETE' });
          fetchTodos();
        }
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };
  
  const handleDeleteConfirmed = async (scope) => {
    setShowDeleteConfirmation(false);
    setDeleteScope(scope);
    
    // Now check for PIN
    try {
      const response = await fetch('/api/settings/has-pin');
      const data = await response.json();
      
      if (data.hasPin) {
        // Global PIN is set, show PIN entry dialog
        setPendingDeleteTodoId(todoToDelete.id);
        setPinAction('delete');
        setShowPinEntry(true);
      } else {
        // No PIN, proceed directly
        await performDelete(todoToDelete.id, scope);
      }
    } catch (error) {
      console.error('Error checking PIN:', error);
    }
  };
  
  const performDelete = async (id, scope) => {
    try {
      let url = `/api/todos/${id}`;
      if (scope === 'series') {
        url += '?scope=series';
      } else if (scope === 'single') {
        url += `?scope=single&date=${currentDate}`;
      }
      // If scope is null (non-recurring), just delete without query params
      
      await fetch(url, { method: 'DELETE' });
      fetchTodos();
      setTodoToDelete(null);
      setDeleteScope(null);
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
          // Proceed with deleting using the stored scope (can be null for non-recurring)
          await performDelete(pendingDeleteTodoId, deleteScope);
          setPendingDeleteTodoId(null);
          setDeleteScope(null);
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
        
        // Show celebration if celebrationPoints are provided
        if (updates.celebrationPoints) {
          setCelebrationData(updates.celebrationPoints);
        }
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

  const handleResetTodos = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/todos`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to reset todos');
      }
      
      // Capture state before fetchUsers modifies it
      const wasCurrentUser = currentUser?.id === userId;
      const wasNotOpenList = !isOpenListSelected;
      
      // Refresh users list while preserving Open List mode
      const refreshedUsers = await fetchUsers({ preserveSelection: true });
      
      // Only fetch todos if the reset user was the current user AND we weren't in Open List mode
      if (wasCurrentUser && wasNotOpenList) {
        const refreshedUser = refreshedUsers.find(u => u.id === userId);
        if (refreshedUser) {
          await fetchTodos(refreshedUser);
        }
      }
      
      alert('All to-dos have been deleted for this user.');
    } catch (error) {
      console.error('Error resetting todos:', error);
      alert('Failed to reset todos. Please try again.');
    }
  };

  const handleResetPoints = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/reset-points`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to reset points');
      }
      // Refresh users list while preserving Open List mode
      await fetchUsers({ preserveSelection: true });
      alert('All points have been reset for this user.');
    } catch (error) {
      console.error('Error resetting points:', error);
      alert('Failed to reset points. Please try again.');
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
        onResetTodos={handleResetTodos}
        onResetPoints={handleResetPoints}
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
          onDone={(callback) => setDoneCallback(() => callback)}
          onPause={(callback) => setPauseCallback(() => callback)}
        />
      )}

      <RedMenu 
        globalPin={globalPin}
        onSavePin={handleSaveGlobalPin}
      />
      <BlueMenu 
        globalPin={globalPin}
        onSavePin={handleSaveGlobalPin}
      />
      <CelebrationMenu 
        celebrationData={celebrationData}
        onClose={() => setCelebrationData(null)}
      />
      {showDeleteConfirmation && todoToDelete && (
        <DeleteConfirmationModal
          todo={todoToDelete}
          onClose={() => {
            setShowDeleteConfirmation(false);
            setTodoToDelete(null);
          }}
          onDeleteOne={() => handleDeleteConfirmed('single')}
          onDeleteAll={() => handleDeleteConfirmed('series')}
        />
      )}
      <QuarterCircle onClick={() => {
        if (!currentUser) {
          alert('Please select a user first to create a new todo!');
          return;
        }
        setShowForm(true);
      }} />
      
      <div style={{
        position: 'fixed',
        bottom: '-100px',
        right: '-50px',
        transform: 'rotate(20deg) scale(1.1)',
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

      <button 
        className={`left-green-pill ${selectedTodo ? 'slide-up' : ''}`}
        onClick={() => {
          if (selectedTodo && doneCallback) {
            doneCallback();
          }
        }}
      >
        <div className={`yellow-circle ${selectedTodo ? 'animate' : ''}`}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 20 L16 28 L29 10" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      <button 
        className={`right-pink-pill ${selectedTodo ? 'slide-up' : ''}`}
        onClick={() => {
          if (selectedTodo && pauseCallback) {
            pauseCallback();
          }
        }}
      >
        <div className={`blue-circle ${selectedTodo ? 'animate' : ''}`}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="14" y1="10" x2="14" y2="30" stroke="white" strokeWidth="8" strokeLinecap="round"/>
            <circle cx="14" cy="10" r="4" fill="black"/>
            <line x1="26" y1="10" x2="26" y2="30" stroke="white" strokeWidth="8" strokeLinecap="round"/>
            <circle cx="26" cy="10" r="4" fill="black"/>
          </svg>
        </div>
      </button>

      <svg className={`half-moon-shape ${moonAnimating ? 'animating' : ''}`} width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="blackShapeMask">
            <circle cx="50" cy="50" r="40" fill="white"/>
          </mask>
        </defs>
        <circle cx="50" cy="50" r="40" fill="black"/>
        <circle cx="10" cy="50" r="30" fill="#EE4100" mask="url(#blackShapeMask)"/>
        <ellipse className="moon-reveal" cx="80" cy="50" rx={moonAnimating ? "28" : "80"} ry={moonAnimating ? "40" : "48"} fill="#E4F4E4"/>
      </svg>
    </div>
  );
}

export default App;
