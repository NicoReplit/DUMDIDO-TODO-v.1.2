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

  // Calculate how many days were completed (for visual progress)
  const completedDays = weekData.filter(day => day.completed).length;
  
  // Calculate orange pill width - grows to cover completed days
  // Base 50px + width per completed day (approximately 60px per day on desktop)
  const pillWidth = 50 + (completedDays * 60);

  return (
    <div className="dumbledido-week-calendar">
      <div className="week-calendar-wrapper">
        {/* Day labels on top */}
        <div className="week-day-labels">
          <div className="week-label-tage">Tage</div>
          {weekData.map((day, index) => (
            <div key={index} className="week-day-label">
              {day.day}
            </div>
          ))}
        </div>
        
        {/* Main week pill */}
        <div className="week-content">
          <div 
            className="streak-counter"
            style={{ width: `${pillWidth}px` }}
          >
            {streakDays}
          </div>
          {weekData.map((day, index) => (
            <div key={index} className="week-day-cell">
              <div className="week-day-eye">
                {day.isPast ? (
                  <div className="week-eye-closed"></div>
                ) : (
                  <div className="week-eye-open"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeekCalendar;
