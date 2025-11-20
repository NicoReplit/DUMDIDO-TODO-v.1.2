# UI Index Reference Map

This document maps index numbers to actual UI objects for easy identification and modification.

## Index-to-Component Mapping

| Index | UI Object Name | CSS Class | File Location | Description |
|-------|---------------|-----------|---------------|-------------|
| 1 | App Name | `.dumbledido-logo` | `src/App.jsx` | DUMDIDO-THE-DO title |
| 2 | Subtitle Text | `.header-subtitle` | `src/App.jsx` | "FAMILIEN-AUFGABENLISTE" text |
| 3 | Date Picker | `.date-pill` | `src/App.jsx` | Calendar date input |
| 4 | White Box | `.header-content` | `src/App.css` | White background header box |
| 5 | Blue Line | `.app-header::after` | `src/App.css` | Blue separator line |
| 6 | User Buttons | `UserSelector` component | `src/components/UserSelector.jsx` | OPEN LIST, CARLA, DADY, etc. |
| 7 | Progress Bar | `ProgressBar` component | `src/components/ProgressBar.jsx` | Blue bar with pink points |
| 8 | Week Calendar | `WeekCalendar` component | `src/components/WeekCalendar.jsx` | Orange/yellow calendar with eyes |
| 9 | Todo List | `TodoList` component | `src/components/TodoList.jsx` | Todo cards area |
| 10 | Blue Circle | `.blue-circle` | `src/components/BlueMenu.jsx` | Blue circle with eyes (settings menu) |
| 11 | Add Button | `.quarter-circle-wrapper` | `src/components/QuarterCircle.jsx` | Blue quarter circle with plus |
| 12 | Super Points Pill | `.left-red-pill` | `src/App.css` | Red pill with star (left side) |
| 13 | Red Circle Menu | `RedMenu` component | `src/components/RedMenu.jsx` | Red circle with eyes (bottom center) |
| 14 | Pause/Done Pill | `.right-green-pill` | `src/App.css` | Pink pill (pause/done button) |
| 15 | Pink ZigZag | `ZigZag` component | `src/components/ZigZag.jsx` | Pink zigzag character with eyes |

## Usage

When requesting changes like "move index 12 to align with index 15," this means:
- Modify the **actual UI object** (`.left-red-pill`)
- To align with the **actual UI object** (`ZigZag` component)
- The index markers themselves are just labels and remain fixed to their objects
