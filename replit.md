# Family To-Do App

## Overview
A touch-optimized to-do list application for families to share on a Raspberry Pi with a touchscreen. It allows each family member to create and manage their to-dos with timer functionality, track progress through gamification, and manage shared household tasks. The project aims to provide a multi-user, local-only solution for family task management. The business vision is to provide a playful, kid-friendly task management solution that promotes family collaboration and responsibility.

## User Preferences
- Mobile-first, touch-optimized design
- Local-only operation (no internet required)
- Family-friendly interface
- DUMBLEDIDO theme: Playful, kid-friendly aesthetic with vibrant colors and rounded shapes

## System Architecture

### UI/UX Decisions
The application features a touch-friendly interface optimized for tablets and touchscreens, incorporating swipe gestures for task management. It includes a user selection interface with a three-gesture interaction system (TAP to select, HOLD to scroll, SWIPE LEFT/RIGHT to edit). Visual feedback elements like green checkmarks and pause icons are used.

A week calendar tracks completion statuses with a dynamic orange progress bar that grows to reach each day's eye as days pass, along with a day counter. The timer features a gradient overtime ring visualization from yellow-green to red for accumulated overtime.

A playful red circular character ("RedMenu") at the bottom center provides access to global PIN settings via swipe gestures (SWIPE UP to open, SWIPE DOWN to close). A blue quarter-circle menu ("TodoMenu") in the bottom-right corner with a centered white cross rotated 90 degrees expands as a full circle overlay when clicked, providing access to "Neue Aufgabe" (add new todo) and "Offene Liste" (open list) options. The TodoMenu follows the established circular expansion pattern with transform-based scaling and scrollable pill content. All modals and menus adhere to a systematic z-index hierarchy for correct layering, with confetti being the highest layer. Todo cards feature a three-layer swipe-to-edit pill system with playful icons and random rotation. The UI incorporates the "DUMBLEDIDO" theme with MuseoModerno font and a vibrant 12-color palette. Decorative half-moon shape overlays with completion animations are used to enhance user engagement. The todo detail view includes playful character elements for the timer.

### Technical Implementations
The application is a full-stack solution with a React frontend and a Node.js/Express backend, using a PostgreSQL database. Key features include:
- **User Management**: Creation, editing, and deletion of users with custom names and colors.
- **Global PIN Security**: A family-wide 4-digit PIN, managed via the RedMenu, protects all todo edit/delete operations. PINs are stored with bcrypt hashing.
- **Open List - Shared Family Tasks**: A dedicated section for unassigned tasks, allowing any family member to claim them for bonus points. Once claimed and completed, the todo appears on the user's personal list for future reference.
- **To-Do Management**: Creation, updating, and deletion of tasks with title, description, estimated time, and recurrence options (daily, weekly, one-time). Swipe-to-delete is implemented for completed todos, with specific handling for recurring tasks (delete single instance or entire series), protected by PIN verification.
- **Timer Functionality**: Start, pause, and complete tasks with a countdown timer that tracks overtime and persists across navigation, allowing multiple simultaneous timers. The timer interface was redesigned for simplicity.
- **Gamification System**:
    - **Points**: Earned based on estimated time, completion time, and bonuses (e.g., no-pause, open list).
    - **Super Points**: Special points to count tasks as on-time. Double-click bug with super points pill was fixed.
    - **Streaks**: Tracking consecutive days of task completion with bonuses.
    - **Week Calendar**: Visual representation of daily completion status.
    - **Perfect Day Celebration**: Awards 10 bonus points when all todos are completed on time for a day. Features a 2-second full-screen celebration with cascading yellow star animations (80x80px) and individual word animations displaying "Monaterstark! 10 Bonus Punkte Verdient." with 5px spacing between lines. Animation scales down smoothly before closing. Only awarded once per day per user.
- **User Settings Reset**: Functionality to reset all todos or all points/streaks for a user, with double confirmation and PIN verification, ensuring smart state management during these operations.

### System Design Choices
- **Technology Stack**: React 18 (Vite), Node.js (Express), PostgreSQL.
- **Database Schema**: Includes `users`, `todos`, `daily_completions`, `recurring_todo_exceptions` (to track deleted instances of recurring todos), and `settings` (for global PIN hash).
- **API Endpoints**: Comprehensive RESTful API for managing users, todos (including claiming open list tasks), gamification features, and global settings, including endpoints for PIN verification and management, and flexible todo deletion with scope parameters.
- **Mobile-First Design**: CSS is implemented with a mobile-first approach.

## External Dependencies

-   **PostgreSQL**: Primary database for persistent data storage.
-   **React**: Frontend library.
-   **Vite**: Frontend build tool.
-   **Node.js**: Backend server runtime.
-   **Express**: Web application framework for the API.
-   **bcrypt**: Library for hashing PINs.