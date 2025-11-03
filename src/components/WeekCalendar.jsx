import { useState, useEffect } from 'react';
import AnimatedEyes from './AnimatedEyes';
import './WeekCalendar.css';

function WeekCalendar({ userId, selectedDate }) {
  const [weekData, setWeekData] = useState([]);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    if (!userId) return;
    fetchWeekCompletions();
    fetchUserStreak();
  }, [userId, selectedDate]);

  const fetchUserStreak = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      setStreakDays(user.current_streak_days || 0);
    } catch (error) {
      console.error('Error fetching user streak:', error);
    }
  };

  const fetchWeekCompletions = async () => {
    const current = new Date(selectedDate);
    const dayOfWeek = current.getDay();
    const monday = new Date(current);
    monday.setDate(current.getDate() - ((dayOfWeek === 0 ? 7 : dayOfWeek) - 1));

    const week = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      
      try {
        const response = await fetch(`/api/daily-completion?user_id=${userId}&date=${dateStr}`);
        const data = await response.json();
        
        const isPast = date < today;
        const isFuture = date > today;
        const isToday = date.getTime() === today.getTime();
        
        week.push({
          day: ['Mo', 'Di', 'Mit', 'Do', 'Fr', 'Sa', 'So'][i],
          date: dateStr,
          completed: data.all_completed_on_time,
          isPast,
          isFuture,
          isToday
        });
      } catch (error) {
        const isPast = date < today;
        const isFuture = date > today;
        const isToday = date.getTime() === today.getTime();
        
        week.push({
          day: ['Mo', 'Di', 'Mit', 'Do', 'Fr', 'Sa', 'So'][i],
          date: dateStr,
          completed: false,
          isPast,
          isFuture,
          isToday
        });
      }
    }
    
    setWeekData(week);
  };

  return (
    <div className="dumbledido-week-calendar">
      <div className="week-header">
        <div className="week-label">TAGE</div>
        {weekData.map((day, index) => (
          <div key={index} className="week-day-header">
            {day.day}
          </div>
        ))}
      </div>
      
      <div className="week-content">
        <div className="streak-counter">{streakDays}</div>
        {weekData.map((day, index) => (
          <div key={index} className="week-day-eye">
            <AnimatedEyes closed={day.isPast} size="small" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekCalendar;
