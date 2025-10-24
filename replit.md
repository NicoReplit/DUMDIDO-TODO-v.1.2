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
✅ Multi-user support
✅ Recurring tasks (daily and weekly patterns)

## Recent Changes
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
│   │   ├── UserSelector.jsx     # Family member selection
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
- created_at (timestamp)
- completed_at (timestamp)

### API Endpoints
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/todos?user_id=X&date=YYYY-MM-DD` - Get todos for user/date
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## Features
1. **User Management**: Switch between family members
2. **To-Do Creation**: Title, description, estimated time, date/recurrence
3. **Swipe Gestures**: Swipe left to reveal edit/delete buttons
4. **Timer Function**: Start, pause, and complete tasks with countdown
5. **Recurring Tasks**: Daily or specific days of the week
6. **Visual Feedback**: Green checkmark for completed, pause icon for paused
7. **Date Navigation**: Browse to-dos by date

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
