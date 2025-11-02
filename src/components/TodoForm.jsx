import { useState } from 'react';
import './TodoForm.css';

function TodoForm({ todo, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    estimated_minutes: todo?.estimated_minutes || '',
    specific_date: todo?.specific_date || '',
    recurrence_type: todo?.recurrence_type || '',
    recurrence_days: todo?.recurrence_days ? JSON.parse(todo.recurrence_days) : [],
    is_open_list: todo?.is_open_list || false
  });

  const daysOfWeek = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      recurrence_days: formData.recurrence_days.length > 0 
        ? JSON.stringify(formData.recurrence_days) 
        : null
    };
    onSave(submitData);
  };

  const handleRecurrenceChange = (type) => {
    setFormData({
      ...formData,
      recurrence_type: type,
      specific_date: type ? '' : formData.specific_date,
      recurrence_days: type === 'weekly' ? formData.recurrence_days : []
    });
  };

  const toggleDay = (day) => {
    setFormData({
      ...formData,
      recurrence_days: formData.recurrence_days.includes(day)
        ? formData.recurrence_days.filter(d => d !== day)
        : [...formData.recurrence_days, day]
    });
  };

  return (
    <div className="todo-form-container">
      <div className="form-header">
        <h2>{todo ? 'Edit To-Do' : 'New To-Do'}</h2>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="What needs to be done?"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add more details..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Estimated Time (minutes)</label>
          <input
            type="number"
            value={formData.estimated_minutes}
            onChange={(e) => setFormData({ ...formData, estimated_minutes: e.target.value })}
            placeholder="e.g., 30"
            min="1"
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.is_open_list}
              onChange={(e) => setFormData({ 
                ...formData, 
                is_open_list: e.target.checked,
                specific_date: '',
                recurrence_type: '',
                recurrence_days: []
              })}
            />
            <span className="checkbox-text">
              📋 <strong>Open List</strong> - Anyone can claim and earn bonus points!
            </span>
          </label>
        </div>

        {!formData.is_open_list && (
          <>
            <div className="form-group">
              <label>Schedule</label>
              <div className="schedule-options">
                <button
                  type="button"
                  className={`schedule-btn ${!formData.recurrence_type && !formData.specific_date ? 'active' : ''}`}
                  onClick={() => handleRecurrenceChange('')}
                >
                  One Time
                </button>
                <button
                  type="button"
                  className={`schedule-btn ${formData.recurrence_type === 'daily' ? 'active' : ''}`}
                  onClick={() => handleRecurrenceChange('daily')}
                >
                  Daily
                </button>
                <button
                  type="button"
                  className={`schedule-btn ${formData.recurrence_type === 'weekly' ? 'active' : ''}`}
                  onClick={() => handleRecurrenceChange('weekly')}
                >
                  Weekly
                </button>
              </div>
            </div>

            {!formData.recurrence_type && (
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.specific_date}
                  onChange={(e) => setFormData({ ...formData, specific_date: e.target.value })}
                />
              </div>
            )}

            {formData.recurrence_type === 'weekly' && (
              <div className="form-group">
                <label>Select Days</label>
                <div className="days-selector">
                  {daysOfWeek.map(day => (
                    <button
                      key={day.value}
                      type="button"
                      className={`day-btn ${formData.recurrence_days.includes(day.value) ? 'active' : ''}`}
                      onClick={() => toggleDay(day.value)}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default TodoForm;
