# Family To-Do App

## Overview
A touch-optimized to-do list application for families to share on a Raspberry Pi with a touchscreen. It allows each family member to create and manage their to-dos with timer functionality, track progress through gamification, and manage shared household tasks. The project aims to provide a multi-user, local-only solution for family task management.

## User Preferences
- Mobile-first, touch-optimized design
- Local-only operation (no internet required)
- Family-friendly interface
- DUMBLEDIDO theme: Playful, kid-friendly aesthetic with vibrant colors and rounded shapes

## Recent Updates (November 2025)

### Half Moon Shape Overlay (November 13, 2025)
Added a decorative half moon shape overlay:
- **Position**: Fixed in the center of the screen
- **Size**: 200x200 pixels (increased for better visibility)
- **Color**: Black
- **Shape**: Crescent moon with open side facing right, created using two overlapping circles
- **Implementation**: Black circle (r=40) overlapped by background-color circle (r=40) positioned 40px to the right
- **Layer**: Top layer (z-index: 15000)
- **Interaction**: Non-interactive (pointer-events: none)

### Todo Detail Timer Redesign (November 13, 2025)
Redesigned the todo detail view with playful character elements:
- **Header**: 
  - Removed gradient background
  - Close button: solid red (#EE4100) circle, 60x60 pixels
  - White cross (8px thick stroke) created with CSS pseudo-elements, rounded ends
  - Red filled background
- **Timer Circle**: 
  - Pushed up 70px total from original position (margin: -20px)
  - Inner color changed to green (#38D247) from palette
  - Play button triangle has rounded corners (3px border-radius)
  - Play button positioned at exact center using absolute positioning
  - Increased distance between play button and time display (bottom: 50px)
  - Added two eyes at top edge with random rotation (-20° to +20°)
  - Black pupils positioned off-center for playful look
  - Text color changed to white for better contrast on green background

### Super Points Double-Click Bug Fix (November 12, 2025)
Fixed bug where double-clicking the super points red pill would accidentally trigger BlueMenu/CelebrationMenu:
- **Issue**: BlueMenu (z-index 10000) and CelebrationMenu (z-index 12000) were always interactive, positioned near super points pill (z-index 9998)
- **Problem**: When double-clicking super points pill, second click would hit BlueMenu/CelebrationMenu underneath, triggering PIN settings animation
- **Solution**: Added `pointer-events: none` to both menu circles in inactive state; only become interactive when opened
- **Result**: Super points pill is now fully clickable - double-clicks work correctly without triggering wrong menus

### Z-Index Hierarchy for Modals (November 12, 2025)
Implemented a systematic z-index hierarchy to ensure all popup windows appear correctly layered:
- **CSS Custom Properties**: Centralized z-index values in `:root` for consistency
  - `--z-base`: 0 (default elements)
  - `--z-floating`: 100 (floating buttons, add button)
  - `--z-sticky`: 500 (sticky elements)
  - `--z-menu`: 10000 (RedMenu, BlueMenu, and their settings overlays)
  - `--z-modal-overlay`: 11000 (all modal overlays - warnings, PIN entry, user settings)
  - `--z-modal-content`: 11001 (modal dialog content)
  - `--z-celebration-overlay`: 12000 (CelebrationMenu and victory animations)
  - `--z-confetti`: 13000 (confetti particles - highest layer)
- **Modal Priority**: All modals (UserEditModal, PINEntry, DeleteConfirmationModal, SettingsModal, UserSelectionModal) now appear above menus (z-index 11000+)
- **Layering Order**: Confetti (13000) > Celebration UI (12000) > Modals (11000+) > Menus (10000) > Floating elements (100) > Base (0)
- **Non-blocking Animations**: Confetti uses `pointer-events: none` to stay on top without blocking interaction

### User Settings Reset Features (November 12, 2025)
Implemented reset functionality in UserEditModal with robust state management:
- **Color Selection**: Limited to first 5 colors (Yellow, Blue, Pink, Coral/Red, Green) for consistency
- **Reset To-dos Button**: Deletes all todos for a user with double confirmation + PIN verification
- **Reset Points Button**: Resets total_points, super_points, and current_streak_days to 0 with double confirmation + PIN verification
- **Smart State Management**: 
  - fetchUsers now accepts `{ preserveSelection }` parameter to preserve Open List mode during refreshes
  - fetchTodos accepts optional user parameter to avoid stale state issues
  - Reset operations refresh currentUser when affected user is selected
  - Open List mode is preserved through reset operations (currentUser stays null)
- **Backend Safety**: DELETE /api/users/:id/todos checks user existence and returns 404 if not found
- **Confirmation Flow**: 
  1. First modal explains what will be reset
  2. PIN entry (if global PIN is set)
  3. Final native confirm dialog before execution

### Swipe-to-Delete for Completed Todos (November 12, 2025)
Implemented swipe-to-delete functionality for completed todos with intelligent recurring deletion handling:
- **Swipe Gestures**: Completed todos can be swiped left to reveal delete button (edit button hidden)
- **Recurring Todo Support**: Modal confirmation for recurring todos with two options:
  - "Nur diese Aufgabe löschen" (Delete only this task): Creates exception for current date
  - "Gesamte {recurrence_type} Aufgabe löschen" (Delete entire recurring task): Removes entire series
- **PIN Protection**: Delete operations require global PIN verification (if set)
- **Database Architecture**: Uses `recurring_todo_exceptions` table to track deleted instances with `todo_id`, `exception_date`, and `exception_type` fields
- **Smart Filtering**: GET /api/todos endpoint excludes todos with exceptions matching query date
- **Delete Flow**: Modal (for recurring) → User selects scope → PIN verification → Backend deletion with scope parameter (null/single/series)

### Timer Interface Redesign (November 10, 2025)
Simplified todo detail timer controls for better visual hierarchy:
- **Centered Play Button**: Rounded yellow (#FECE00) play button (80px diameter, 70px on mobile) positioned in the center of the timer circle when not running
- **Estimated Time Display**: Shows estimated minutes below the play button inside the circle (fallback to "No estimate" if missing)
- **Removed Standalone Start Button**: Eliminated separate start button below timer; play functionality now integrated within the circle
- **Accessibility**: Added aria-label to play button for screen reader support
- **Responsive Design**: Play button and estimated time scale appropriately on smaller screens

### DUMBLEDIDO Visual Redesign
Complete visual transformation to a playful, kid-friendly design system:
- **Typography**: MuseoModerno font (Google Fonts) applied globally
- **Color Palette**: Custom 12-color palette with vibrant, saturated colors
  - Yellow: #FECE00, Blue: #0061EE, Pink: #FF006E, Coral/Red: #EE4100
  - Green: #38D247, Orange: #FEBA00, Light Pink: #FF77B9, Magenta: #EE00AE
  - Gray: #707070, Light Gray/BG: #E4F4E4, Black: #000000, White: #FFFFFF
- **Todo Cards**: Three-layer swipe-to-edit pill system
  - Bottom layer: #EE4100 (red), 100% width, carries 7px 7px blue drop shadow, delete icon 25px from right edge
  - Middle layer: #38D247 (green), 50px narrower, no shadow, edit icon 25px from right edge
  - Top layer: Task color, 100% width initially, shrinks 100px when swiped to reveal icons underneath
  - Time pill: Orange (#FEBA00), z-index 10, always on top of all layers
  - Card spacing: 30px between cards (desktop), 25px (mobile)
  - Random rotation: -2° to +2° per card for playful scattered appearance
  - Icons: No circles, no shadows, just emoji (🗑️ bin, ✏️ pen)
  - Swipe gestures: Left to open edit mode, right to close
  - Clickability: Entire card in normal mode, only icons in edit mode
- **User Interface**: Colorful pill buttons, animated blob characters, progress bars with heart-eyes emoji

## System Architecture

### UI/UX Decisions
The application features a touch-friendly interface optimized for tablets and touchscreens, incorporating swipe gestures for task management. It includes a user selection interface with three-gesture interaction system:
- **TAP**: Select user
- **HOLD (200ms)**: Scroll through users
- **SWIPE LEFT/RIGHT**: Show/hide edit icon for user editing

Additional features include a week calendar for tracking completion statuses with dynamic progress visualization:
- **Week Calendar Progress Bar**: Orange bar (#FF8800) that grows to reach each day's eye as days pass
- **Day Counter**: Shows days since Monday (1-7), resets each Monday
- **Eye States**: Closed eyes (smiley faces) for completed/current days, open eyes for future days
- **Responsive Calculation**: Bar width calculated dynamically using DOM measurements to work on any screen resolution
- Visual feedback elements like green checkmarks and pause icons
- A prominent feature is the gradient overtime ring visualization for the timer, which uses a color gradient from yellow-green to red to indicate accumulated overtime.

**RedMenu Character**: A playful red circular character at the bottom center of the screen that provides access to global PIN settings:
- **SWIPE UP**: Opens settings UI inside the scaled-up red circle
- **SWIPE DOWN**: Closes settings and resets form
- Settings are displayed centered within the enlarged red circle (scale 3.85x)
- PIN confirmation required when creating or changing PIN (must enter twice)
- Current PIN verification required for all protected operations (change/remove PIN)

A global PIN system (accessed via RedMenu) protects all todo edit/delete operations for the entire family.

### Technical Implementations
The application is a full-stack solution with a React frontend and a Node.js/Express backend. It uses a PostgreSQL database for data persistence. Key features include:
- **User Management**: Creation, editing, and deletion of users with custom names and colors.
- **Global PIN Security**: Single family-wide 4-digit PIN accessible via RedMenu character (swipe up to open). Protects all todo edit/delete operations across all users. PIN must be entered twice when creating or changing. Current PIN required for all sensitive operations. Stored in `settings` table with bcrypt hashing.
- **Open List - Shared Family Tasks**: A dedicated section for tasks not assigned to any specific user, allowing any family member to claim them for bonus points.
- **To-Do Management**: Creation, updating, and deletion of tasks with title, description, estimated time, and recurrence options (daily, weekly, or one-time).
- **Timer Functionality**: Start, pause, and complete tasks with a countdown timer that tracks overtime and persists across navigation, allowing multiple simultaneous timers.
- **Gamification System**:
    - **Points**: Earned based on estimated time, completion time, and bonuses (e.g., no-pause bonus, open list bonus).
    - **Super Points**: Special points used to count tasks as on-time.
    - **Streaks**: Tracking consecutive days of task completion with streak bonuses.
    - **Week Calendar**: Visual representation of daily completion status.

### System Design Choices
- **Technology Stack**: React 18 with Vite for the frontend, Node.js with Express for the backend, and PostgreSQL for the database.
- **Database Schema**: Structured with `users`, `todos`, `daily_completions`, `recurring_todo_exceptions`, and `settings` tables. The `settings` table stores the global PIN hash for family-wide security. The `recurring_todo_exceptions` table tracks deleted instances of recurring todos.
- **API Endpoints**: Comprehensive RESTful API for managing users, todos (including claiming open list tasks), gamification features, and global settings. Key endpoints include:
  - `GET /api/settings/has-pin`: Check if global PIN is set
  - `POST /api/settings/verify-pin`: Verify global PIN for protected operations
  - `PUT /api/settings`: Update global PIN (set, change, or remove)
  - `DELETE /api/todos/:id`: Delete todos with optional scope parameter (single/series) and date for recurring exceptions
  - `DELETE /api/users/:id/todos`: Reset all todos for a user (validates user existence)
  - `PUT /api/users/:id/reset-points`: Reset points, super points, and streak for a user
- **Mobile-First Design**: CSS is implemented with a mobile-first approach, ensuring optimal performance on touch devices.

## External Dependencies

-   **PostgreSQL**: Used as the primary database for persistent data storage.
-   **React**: Frontend library for building the user interface.
-   **Vite**: Frontend build tool for React.
-   **Node.js**: JavaScript runtime for the backend server.
-   **Express**: Web application framework for Node.js, used to build the API.
-   **bcrypt**: Library for hashing user PINs securely.