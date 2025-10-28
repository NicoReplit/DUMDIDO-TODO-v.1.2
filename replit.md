# Family To-Do App

## Overview
A touch-optimized to-do list application designed for families to share on a Raspberry Pi with touchscreen. Each family member can create and manage their own to-dos with timer functionality.

## Purpose
- Multi-user to-do management for families
- Touch-friendly interface optimized for tablets and touchscreens
- Timer feature to track time spent on tasks
- Recurring tasks support (daily, weekly)
- Runs locally on Raspberry Pi without internet connection

## Current State
✅ Full-stack application with React frontend and Node.js backend
✅ PostgreSQL database for data persistence
✅ Touch-optimized UI with swipe gestures
✅ Timer functionality with countdown
✅ Multi-user support with full CRUD operations
✅ Recurring tasks (daily and weekly patterns)
✅ User customization (names and colors)

## Recent Changes
- 2025-10-28: Gradient overtime ring visualization
  - **Multi-colored overlapping rings**: Each overtime minute adds a new colored ring
  - **Color gradient progression**: Yellow → Lime → Green → Orange → Red → Dark Red
  - **Visual accumulation**: Completed minutes stay at 100%, current minute grows 0→100%
  - **SVG-based rendering**: Smooth animations with overlapping stroke effects
  - Minute 0: Yellow ring builds up (urgency starting)
  - Minute 1: Lime ring builds (yellow stays full)
  - Minute 2: Green ring builds (yellow + lime stay full)
  - Minute 3: Orange ring builds (showing heat)
  - Minute 4+: Red/dark red rings (maximum urgency)
  - Creates visual "heat map" showing total overtime accumulation

- 2025-10-27: Recurring todos daily reset & timer overtime fixes (PRODUCTION READY)
  - **Recurring todos now properly reset daily**: 
    - Added `last_activity_date` column to track when recurring todos were last used
    - GET endpoint checks if last_activity_date matches current date
    - New day → completely resets to fresh state (timer, pause status, etc.)
    - Same day → preserves in-progress state (paused timer, super point usage)
    - Completed day → shows completion data from recurring_todo_completions table
  - **Timer overtime fully working**:
    - Timer counts positive overtime when past estimated time (e.g., +5:30)
    - Red background with white text when in overtime
    - Displays "+HH:MM" format and "OVERTIME" label
    - Timer can go negative (removed clamp at 0 in App.jsx)
  - **Negative points working**:
    - Points calculation allows negative values when overtime exceeds base points
    - Overtime minutes subtract from base points, can go below zero
    - Negative points subtract from user's total accumulated points
  - **Database schema updates**:
    - Added ALTER TABLE migration for last_activity_date to handle existing databases
    - PUT endpoint now persists all in-progress state (pause_used, super_point_used, etc.)
    - Response uses nullish coalescing to properly return saved state

- 2025-10-27: Background timer persistence feature
  - Moved timer state management from TodoDetail to App.jsx for persistence
  - Timers now continue running when user navigates away (presses back button)
  - Multiple users can run their own timers simultaneously without interference
  - Visual indicators (▶️ pulsing play icon) show which tasks have active timers in TodoList
  - TodoDetail automatically connects to existing running timer when reopened
  - Proper interval cleanup to prevent memory leaks
  - All timer calculations (elapsed time, overtime, points) remain accurate across navigation

- 2025-10-25: Gamification system implementation
  - Points system: 1 point per minute estimated, time bonus/penalty based on actual time
  - 10% no-pause bonus for completing without pausing
  - Super points: 12 per user, can be used to count task as on-time
  - Streak tracking: Week calendar shows Mon-Sun completion status
  - Streak bonuses: 7 days = +10pts, 30 days = +30pts, 90 days = +50pts, 365 days = +12 super points
  - Daily completion tracking to detect when all tasks completed on-time
  - Points celebration UI shows breakdown when task completed
  - User stats display in UserSelector with points and super points
  - WeekCalendar component with green checkmarks for completed days
  - Fixed timer to track actual elapsed time including overtime

- 2025-10-24: User management feature implementation
  - Added UserForm component for creating/editing users
  - Implemented user editing via pencil icon in header
  - Added user creation via plus button in user selector
  - Implemented user deletion with confirmation dialog
  - Added PUT /api/users/:id and DELETE /api/users/:id endpoints
  - Added server-side validation (name required, color format)
  - Added 404 handling and error responses for API endpoints
  - Fixed state management for user CRUD operations
  - Users table has ON DELETE CASCADE for automatic todo cleanup

- 2025-10-24: Initial project setup & bug fixes
  - Created React (Vite) frontend with touch-optimized components
  - Built Node.js/Express backend API
  - Set up PostgreSQL database with users and todos tables
  - Implemented swipe gestures for edit/delete
  - Added countdown timer functionality
  - Created user selection interface
  - Added support for one-time, daily, and weekly recurring tasks
  - Fixed Vite configuration to allow Replit preview (allowedHosts: true)
  - Resolved server port conflicts for stable operation
  - Verified daily to-do creation and display functionality

## Project Architecture

### Technology Stack
- **Frontend**: React 18 with Vite
- **Backend**: Node.js with Express
- **Database**: PostgreSQL (local)
- **Styling**: CSS (mobile-first design)

### Project Structure
```
/
├── server/
│   └── index.js          # Express API server
├── src/
│   ├── components/
│   │   ├── UserSelector.jsx     # Family member selection with add
│   │   ├── UserForm.jsx         # User create/edit/delete form
│   │   ├── TodoList.jsx         # List of todos with swipe
│   │   ├── TodoForm.jsx         # Create/edit todo form
│   │   └── TodoDetail.jsx       # Timer and task completion
│   ├── App.jsx           # Main app component
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

### Database Schema
**users table:**
- id (serial, primary key)
- name (varchar)
- color (varchar) - for UI personalization
- total_points (integer) - accumulated points from completed tasks
- super_points (integer) - special points for skipping penalties (default 12)
- current_streak_days (integer) - current consecutive day streak
- created_at (timestamp)

**todos table:**
- id (serial, primary key)
- user_id (integer, foreign key)
- title (varchar)
- description (text)
- estimated_minutes (integer)
- remaining_seconds (integer)
- completed (boolean)
- specific_date (date) - for one-time tasks
- recurrence_type (varchar) - 'daily' or 'weekly'
- recurrence_days (text) - JSON array of day numbers for weekly tasks
- points_earned (integer) - points awarded when completed
- pause_used (boolean) - whether pause button was used
- super_point_used (boolean) - whether super point was used
- actual_time_seconds (integer) - actual time taken to complete
- created_at (timestamp)
- completed_at (timestamp)

**daily_completions table:**
- id (serial, primary key)
- user_id (integer, foreign key)
- completion_date (date)
- all_completed_on_time (boolean) - whether all tasks completed on-time
- created_at (timestamp)
- UNIQUE(user_id, completion_date)

### API Endpoints
**Users:**
- `GET /api/users` - List all users
- `POST /api/users` - Create new user (validates name and color)
- `PUT /api/users/:id` - Update user (validates name and color, returns 404 if not found)
- `DELETE /api/users/:id` - Delete user (cascades to todos, returns 404 if not found)

**Todos:**
- `GET /api/todos?user_id=X&date=YYYY-MM-DD` - Get todos for user/date
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo (includes points calculation and streak tracking)
- `DELETE /api/todos/:id` - Delete todo

**Gamification:**
- `POST /api/users/:id/use-super-point` - Deduct 1 super point from user
- `GET /api/daily-completion?user_id=X&date=YYYY-MM-DD` - Get completion status for date

## Features
1. **User Management**: 
   - Switch between family members
   - Add new users with custom names and colors
   - Edit existing users (pencil icon in header)
   - Delete users with confirmation dialog (cascade deletes all their to-dos)
   - User stats display: points earned and super points available
2. **To-Do Creation**: Title, description, estimated time, date/recurrence
3. **Swipe Gestures**: Swipe left to reveal edit/delete buttons
4. **Timer Function**: 
   - Start, pause, and complete tasks with countdown (tracks overtime)
   - Background timer persistence: timers continue running when navigating away
   - Multiple users can run timers simultaneously
   - Visual indicators show which tasks have active timers
5. **Recurring Tasks**: Daily or specific days of the week
6. **Visual Feedback**: Green checkmark for completed, pause icon for paused
7. **Date Navigation**: Browse to-dos by date
8. **Gamification System**:
   - **Points**: Base points (1/min) + time bonus/penalty + 10% no-pause bonus
   - **Super Points**: 12 per user, use to count task as on-time
   - **Week Calendar**: Mon-Sun strip showing completion status
   - **Streak Bonuses**: 7 days (+10pts), 30 days (+30pts), 90 days (+50pts), 365 days (+12 super points)
   - **Points Celebration**: Shows breakdown when completing tasks
   - **Daily Completion Tracking**: Automatically detects when all tasks done on-time

## Running Locally on Raspberry Pi

### Prerequisites
- Raspberry Pi (any model with sufficient RAM)
- PostgreSQL installed
- Node.js 20+ installed

### Installation Steps
1. Copy entire project to Raspberry Pi
2. Install dependencies: `npm install`
3. Set up PostgreSQL database (create database and set DATABASE_URL)
4. Start backend: `node server/index.js`
5. Start frontend: `npm run dev:client`
6. Access via browser at http://localhost:5000

### For Touchscreen Use
- The app is optimized for touch input
- Use in fullscreen mode (F11 in most browsers)
- Supports touch gestures (swipe, tap)
- No mouse required

## Development
- Frontend runs on port 5000
- Backend API runs on port 3000
- Vite proxy forwards /api requests to backend
- Hot reload enabled for development

## User Preferences
- Mobile-first, touch-optimized design
- Local-only operation (no internet required)
- Family-friendly interface
