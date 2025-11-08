# Family To-Do App

## Overview
A touch-optimized to-do list application for families to share on a Raspberry Pi with a touchscreen. It allows each family member to create and manage their to-dos with timer functionality, track progress through gamification, and manage shared household tasks. The project aims to provide a multi-user, local-only solution for family task management.

## User Preferences
- Mobile-first, touch-optimized design
- Local-only operation (no internet required)
- Family-friendly interface
- DUMBLEDIDO theme: Playful, kid-friendly aesthetic with vibrant colors and rounded shapes

## Recent Updates (November 2025)

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
The application features a touch-friendly interface optimized for tablets and touchscreens, incorporating swipe gestures for task management. It includes a user selection interface with four-gesture interaction system:
- **TAP**: Select user
- **HOLD (200ms)**: Scroll through users
- **SWIPE LEFT/RIGHT**: Show/hide edit icon for user editing
- **SWIPE UP**: Open global PIN settings (parent access)

Additional features include a week calendar for tracking completion statuses, and visual feedback elements like green checkmarks and pause icons. A prominent feature is the gradient overtime ring visualization for the timer, which uses a color gradient from yellow-green to red to indicate accumulated overtime. A global PIN system (accessed via swipe-up on any user blob) protects all todo edit/delete operations for the entire family.

### Technical Implementations
The application is a full-stack solution with a React frontend and a Node.js/Express backend. It uses a PostgreSQL database for data persistence. Key features include:
- **User Management**: Creation, editing, and deletion of users with custom names and colors.
- **Global PIN Security**: Single family-wide 4-digit PIN accessible via swipe-up gesture on any user blob. Protects all todo edit/delete operations across all users. Stored in `settings` table with bcrypt hashing.
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
- **Database Schema**: Structured with `users`, `todos`, `daily_completions`, and `settings` tables. The `settings` table stores the global PIN hash for family-wide security.
- **API Endpoints**: Comprehensive RESTful API for managing users, todos (including claiming open list tasks), gamification features, and global settings. Key security endpoints include:
  - `GET /api/settings/has-pin`: Check if global PIN is set
  - `POST /api/settings/verify-pin`: Verify global PIN for protected operations
  - `PUT /api/settings`: Update global PIN (set, change, or remove)
- **Mobile-First Design**: CSS is implemented with a mobile-first approach, ensuring optimal performance on touch devices.

## External Dependencies

-   **PostgreSQL**: Used as the primary database for persistent data storage.
-   **React**: Frontend library for building the user interface.
-   **Vite**: Frontend build tool for React.
-   **Node.js**: JavaScript runtime for the backend server.
-   **Express**: Web application framework for Node.js, used to build the API.
-   **bcrypt**: Library for hashing user PINs securely.