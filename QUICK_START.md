# Quick Start Guide

## Running the App (Development)

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Open in your browser:**
   - Navigate to `http://localhost:5000`

3. **Use the app:**
   - Select a family member (Dad, Kids, or Mom)
   - Tap the **+** button to create a to-do
   - Fill in the details and save
   - Tap a to-do to start the timer
   - Swipe left on any to-do to edit or delete

## Key Features

### Creating To-Dos
- **Title**: What needs to be done
- **Description**: Optional details
- **Estimated Time**: How long it should take
- **Schedule Options**:
  - One Time: Pick a specific date
  - Daily: Repeats every day
  - Weekly: Choose specific days of the week

### Using the Timer
1. Tap a to-do to open it
2. Press **Start** to begin the countdown
3. Press **Pause** to stop temporarily (progress is saved)
4. Press **Done** to mark complete
5. Press **← Back** to return (progress is saved)

### Touch Gestures
- **Tap** on a to-do to start the timer
- **Swipe left** to reveal edit (✏️) and delete (🗑️) buttons
- **Tap** a user button to switch family members

## For Raspberry Pi

See `RASPBERRY_PI_SETUP.md` for complete installation instructions on your Pi with touchscreen.

## Default Users

The app comes with three default users:
- **Dad** (Blue)
- **Kids** (Green)
- **Mom** (Pink)

You can add more users through the UI or database if needed.

## Tips

- Use fullscreen mode (F11) for a better experience
- The app works offline once loaded
- All data is stored locally in PostgreSQL
- Perfect for a touchscreen kiosk setup
