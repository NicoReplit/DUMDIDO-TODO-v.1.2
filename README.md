# Family To-Do App

A touch-optimized to-do list application designed for families. Perfect for running on a Raspberry Pi with a touchscreen!

## Features

- 👨‍👩‍👧‍👦 **Multi-User Support** - Each family member gets their own to-do list
- ⏱️ **Built-in Timer** - Track time spent on tasks with countdown functionality
- 📅 **Flexible Scheduling** - One-time, daily, or weekly recurring tasks
- 👆 **Touch Optimized** - Swipe gestures and large touch targets
- 💾 **Local Storage** - All data stored in local PostgreSQL database
- 🏠 **Offline First** - Works completely offline once set up

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the application:
```bash
npm run dev
```

3. Open http://localhost:5000 in your browser

## Running on Raspberry Pi

This app is designed to run locally on a Raspberry Pi with a touchscreen:

1. Install Node.js 20+ and PostgreSQL on your Pi
2. Clone this repository
3. Run `npm install`
4. Set up the database connection (DATABASE_URL environment variable)
5. Run `npm run dev` or set up as a service to start on boot
6. Access via browser in fullscreen mode

## Usage

1. **Select User** - Tap a family member's name at the top
2. **Add To-Do** - Tap the + button
3. **Fill Details** - Add title, description, time estimate, and schedule
4. **Start Task** - Tap a to-do to open it, then hit Start to begin the timer
5. **Complete** - Mark done when finished
6. **Manage** - Swipe left on any to-do to edit or delete

## Technology

- React + Vite (Frontend)
- Node.js + Express (Backend)
- PostgreSQL (Database)
- Touch-optimized CSS

## License

MIT
