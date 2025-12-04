import { useState } from 'react';
import './TodoForm.css';

function TodoForm({ todo, onSave, onCancel, defaultOpenList = false }) {
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    estimated_minutes: todo?.estimated_minutes || '',
    specific_date: todo?.specific_date || '',
    recurrence_type: todo?.recurrence_type || '',
    recurrence_days: todo?.recurrence_days ? JSON.parse(todo.recurrence_days) : [],
    is_open_list: todo?.is_open_list || defaultOpenList
  });

  const daysOfWeek = [
    { value: 0, label: 'So' },
    { value: 1, label: 'Mo' },
    { value: 2, label: 'Di' },
    { value: 3, label: 'Mi' },
    { value: 4, label: 'Do' },
    { value: 5, label: 'Fr' },
    { value: 6, label: 'Sa' }
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
        <h2>{todo ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}</h2>
        <button className="close-btn" onClick={onCancel}>
          <img src="/Close.svg" alt="Close" className="close-icon" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group">
          <label>Titel *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Was muss erledigt werden?"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Beschreibung</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Weitere Details hinzufügen..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Geschätzte Zeit (Minuten)</label>
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
              📋 <strong>Offene Liste</strong> - Jeder kann diese Aufgabe übernehmen und Bonuspunkte verdienen!
            </span>
          </label>
        </div>

        {!formData.is_open_list && (
          <>
            <div className="form-group">
              <label>Zeitplan</label>
              <div className="schedule-options">
                <button
                  type="button"
                  className={`schedule-btn ${!formData.recurrence_type && !formData.specific_date ? 'active' : ''}`}
                  onClick={() => handleRecurrenceChange('')}
                >
                  Einmalig
                </button>
                <button
                  type="button"
                  className={`schedule-btn ${formData.recurrence_type === 'daily' ? 'active' : ''}`}
                  onClick={() => handleRecurrenceChange('daily')}
                >
                  Täglich
                </button>
                <button
                  type="button"
                  className={`schedule-btn ${formData.recurrence_type === 'weekly' ? 'active' : ''}`}
                  onClick={() => handleRecurrenceChange('weekly')}
                >
                  Wöchentlich
                </button>
              </div>
            </div>

            {!formData.recurrence_type && (
              <div className="form-group">
                <label>Datum</label>
                <input
                  type="date"
                  value={formData.specific_date}
                  onChange={(e) => setFormData({ ...formData, specific_date: e.target.value })}
                />
              </div>
            )}

            {formData.recurrence_type === 'weekly' && (
              <div className="form-group">
                <label>Tage auswählen</label>
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
            Abbrechen
          </button>
          <button type="submit" className="save-btn">
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
}

export default TodoForm;
