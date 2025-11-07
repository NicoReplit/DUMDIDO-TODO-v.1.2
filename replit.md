# Family To-Do App

## Overview
A touch-optimized to-do list application for families to share on a Raspberry Pi with a touchscreen. It allows each family member to create and manage their to-dos with timer functionality, track progress through gamification, and manage shared household tasks. The project aims to provide a multi-user, local-only solution for family task management.

## User Preferences
- Mobile-first, touch-optimized design
- Local-only operation (no internet required)
- Family-friendly interface
- DUMBLEDIDO theme: Playful, kid-friendly aesthetic with vibrant colors and rounded shapes

## Recent Updates (November 2025)

### iOS-Style Sticky Stacking Implementation (November 7, 2025)
Redesigned todo cards to use iOS notification-style sticky stacking:
- **Sticky Positioning**: Cards use `position: sticky` to stack at the top as you scroll
- **30px Peek Effect**: Each card offsets by 30px, creating a layered peek effect
- **Swipe-to-Reveal**: Horizontal swipe gestures reveal action buttons behind the card
  - Swipe left: Card slides 140px to reveal edit/delete buttons
  - Swipe right: Card slides back to normal position
- **Dynamic Container Heights**: `350 + (index * 30) + 70px` - ensures persistent stickiness
- **Full-Screen Masking**: Scrollable area fills entire viewport (100vh) with `padding-top: 350px; padding-bottom: 0;`
- **Responsive Layout**: Fixed header (logo, calendar, user pills, progress, week calendar) + scrollable todo area + fixed footer (blob characters)
- **Touch Optimized**: All interactions work with touch gestures on mobile/tablet devices

### DUMBLEDIDO Visual Redesign
Complete visual transformation to a playful, kid-friendly design system:
- **Typography**: MuseoModerno font (Google Fonts) applied globally
- **Color Palette**: Custom 12-color palette with vibrant, saturated colors
  - Yellow: #FECE00, Blue: #0061EE, Pink: #FF006E, Coral/Red: #EE4100
  - Green: #38D247, Orange: #FEBA00, Light Pink: #FF77B9, Magenta: #EE00AE
  - Gray: #707070, Light Gray/BG: #E4F4E4, Black: #000000, White: #FFFFFF
- **Todo Cards**: iOS-style sticky stacking with swipe-to-reveal actions
  - Single sticky card layer with action buttons positioned behind
  - Card colors: Alternating yellow (#FECE00), red gradient, green (#38D247), blue (#0061EE)
  - Drop shadows: 7px 7px colored shadows (blue for yellow cards, yellow for red, red for green, green for blue)
  - Card rotation: Alternating +1° / -1° per card for playful scattered appearance
  - Time pill: Orange (#FEBA00), z-index above card, positioned bottom-right
  - iOS-style sticky stacking: Cards stack at top with 30px peek effect as you scroll (inverted from iOS - stacks at TOP)
  - Swipe-to-reveal: Swipe left 140px to reveal green edit button and red delete button behind card
  - Bidirectional swipe: Swipe right to close and hide action buttons
  - Dynamic container heights: `350 + (index * 30) + 70px` ensures cards remain sticky until pushed by next card
  - Full viewport masking: Scrollable area extends from top to bottom under blobs with padding-based layout
  - Icons: 🗑️ bin (red #EE4100 background), ✏️ pen (green #38D247 background)
- **User Interface**: Colorful pill buttons, animated blob characters, progress bars with heart-eyes emoji

## System Architecture

### UI/UX Decisions
The application features a touch-friendly interface optimized for tablets and touchscreens, incorporating swipe gestures for task management. It includes a user selection interface, a week calendar for tracking completion statuses, and visual feedback elements like green checkmarks and pause icons. A prominent feature is the gradient overtime ring visualization for the timer, which uses a color gradient from yellow-green to red to indicate accumulated overtime. PIN protection adds a layer of security for editing or deleting personal tasks.

### Technical Implementations
The application is a full-stack solution with a React frontend and a Node.js/Express backend. It uses a PostgreSQL database for data persistence. Key features include:
- **User Management**: Creation, editing, and deletion of users with custom names, colors, and optional 4-digit PIN protection.
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
- **Database Schema**: Structured with `users`, `todos`, and `daily_completions` tables to manage user profiles, task details (including recurrence, open list status, and gamification metrics), and daily completion records.
- **API Endpoints**: Comprehensive RESTful API for managing users, todos (including claiming open list tasks), and gamification features. Server-side validation and secure PIN hashing (bcrypt) are implemented.
- **Mobile-First Design**: CSS is implemented with a mobile-first approach, ensuring optimal performance on touch devices.

## External Dependencies

-   **PostgreSQL**: Used as the primary database for persistent data storage.
-   **React**: Frontend library for building the user interface.
-   **Vite**: Frontend build tool for React.
-   **Node.js**: JavaScript runtime for the backend server.
-   **Express**: Web application framework for Node.js, used to build the API.
-   **bcrypt**: Library for hashing user PINs securely.