import { useState, useEffect } from 'react';
import './WeekCalendar.css';

function WeekCalendar({ userId, selectedDate }) {
  const [weekData, setWeekData] = useState([]);

  useEffect(() => {
    if (!userId) return;
    fetchWeekCompletions();
  }, [userId, selectedDate]);

  const fetchWeekCompletions = async () => {
    const current = new Date(selectedDate);
    const dayOfWeek = current.getDay();
    const monday = new Date(current);
    monday.setDate(current.getDate() - ((dayOfWeek === 0 ? 7 : dayOfWeek) - 1));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      try {
        const response = await fetch(`/api/daily-completion?user_id=${userId}&date=${dateStr}`);
        const data = await response.json();
        
        week.push({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          date: dateStr,
          completed: data.all_completed_on_time,
          isFuture: date > new Date(),
          isToday: dateStr === new Date().toISOString().split('T')[0]
        });
      } catch (error) {
        week.push({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          date: dateStr,
          completed: false,
          isFuture: date > new Date(),
          isToday: dateStr === new Date().toISOString().split('T')[0]
        });
      }
    }
    
    setWeekData(week);
  };

  return (
    <div className="week-calendar">
      {weekData.map((day, index) => (
        <div
          key={index}
          className={`week-day ${day.completed ? 'completed' : ''} ${day.isFuture ? 'future' : ''} ${day.isToday ? 'today' : ''}`}
        >
          <div className="day-label">{day.day}</div>
          <div className="day-status">
            {day.completed && '✓'}
            {!day.completed && !day.isFuture && '○'}
            {day.isFuture && '-'}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WeekCalendar;
