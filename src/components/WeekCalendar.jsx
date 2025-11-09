import { useState, useEffect, useRef } from 'react';
import AnimatedEyes from './AnimatedEyes';
import './WeekCalendar.css';

function WeekCalendar({ userId, selectedDate }) {
  const [weekData, setWeekData] = useState([]);
  const [barWidth, setBarWidth] = useState(0);
  const containerRef = useRef(null);
  const eyeRefs = useRef([]);

  useEffect(() => {
    if (!userId) return;
    fetchWeekCompletions();
  }, [userId, selectedDate]);

  // Calculate bar width based on actual eye positions
  useEffect(() => {
    if (weekData.length === 0 || !containerRef.current) return;

    const updateBarWidth = () => {
      const container = containerRef.current;
      if (!container) return;

      // Count how many days have passed (including today)
      const pastDays = weekData.filter(day => day.isPast).length;
      
      if (pastDays === 0) {
        // No days passed yet, bar stays at base size
        setBarWidth(0);
        return;
      }

      // Get the eye we need to reach (pastDays - 1 because array is 0-indexed)
      const targetEyeIndex = pastDays - 1;
      const targetEye = eyeRefs.current[targetEyeIndex];
      
      if (!targetEye) return;

      // Get positions relative to container
      const containerRect = container.getBoundingClientRect();
      const eyeRect = targetEye.getBoundingClientRect();
      
      // Calculate the center of the target eye relative to container start
      const eyeCenterX = eyeRect.left + (eyeRect.width / 2) - containerRect.left;
      
      // Bar starts at 7px from left, so we need to reach eyeCenterX from that point
      let barWidthPx = eyeCenterX - 7;
      
      // Max width: container width - 7px (left start) - 2px (right edge margin)
      const maxBarWidth = containerRect.width - 9;
      barWidthPx = Math.min(barWidthPx, maxBarWidth);
      
      setBarWidth(barWidthPx > 0 ? barWidthPx : 0);
    };

    // Delay to ensure DOM is fully rendered
    const timer = setTimeout(updateBarWidth, 100);

    // Update on window resize
    window.addEventListener('resize', updateBarWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateBarWidth);
    };
  }, [weekData]);

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
          isPast: isPast || isToday, // Today counts as past for closed eyes
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
          isPast: isPast || isToday, // Today counts as past for closed eyes
          isFuture,
          isToday
        });
      }
    }
    
    setWeekData(week);
  };

  // Calculate how many days have passed since Monday (1-based counting)
  const daysSinceMonday = weekData.filter(day => day.isPast).length;

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
        <div className="week-content" ref={containerRef}>
          {/* Orange progress bar grows underneath */}
          <div 
            className="week-progress-bar"
            style={{ width: `${barWidth}px` }}
          ></div>
          
          {/* Number stays fixed on left */}
          <div className="streak-counter">
            {daysSinceMonday}
          </div>
          
          {/* Day icons in fixed positions */}
          <div className="week-days-container">
            {weekData.map((day, index) => {
              // Each eye gets a unique rotation based on its index
              const rotations = [14, 180, 45, -60, 80, 0, 120];
              const eyeRotation = rotations[index];
              
              return (
                <div 
                  key={index} 
                  className="week-day-cell"
                  ref={(el) => eyeRefs.current[index] = el}
                >
                  <div className="week-day-eye">
                    {day.isPast ? (
                      <div className="week-eye-closed"></div>
                    ) : (
                      <div 
                        className="week-eye-open"
                        style={{ transform: `rotate(${eyeRotation}deg)` }}
                      ></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeekCalendar;
