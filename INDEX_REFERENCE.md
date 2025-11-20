# UI Index Reference Map

This document maps index numbers to actual UI objects for easy identification and modification.

## Index-to-Component Mapping

| Index | UI Object Name | CSS Class | File Location | Description |
|-------|---------------|-----------|---------------|-------------|
| 1 | App Name | `.dumbledido-logo` | `src/App.jsx` | DUMDIDO-THE-DO title |
| 2 | Subtitle Text | `.header-subtitle` | `src/App.jsx` | "FAMILIEN-AUFGABENLISTE" text |
| 3 | Date Picker | `.date-pill` | `src/App.jsx` | Calendar date input |
| 4 | White Box | `.custom-rectangle` | `src/App.css` | White background box (defines content boundaries) |
| 5 | Blue Line | `.app-header::after` | `src/App.css` | Blue separator line |
| 6 | User Buttons | `UserSelector` component | `src/components/UserSelector.jsx` | OPEN LIST, CARLA, DADY, etc. |
| 7 | Progress Bar | `ProgressBar` component | `src/components/ProgressBar.jsx` | Blue bar with pink points |
| 8 | Week Calendar | `WeekCalendar` component | `src/components/WeekCalendar.jsx` | Orange/yellow calendar with eyes |
| 9 | Todo List | `TodoList` component | `src/components/TodoList.jsx` | Todo cards area |
| 10 | Blue Circle | `.blue-circle-background` | `src/components/BlueMenu.css` | Blue circle with eyes (settings menu) - aligned to LEFT boundary |
| 11 | Add Button | `.quarter-circle-wrapper` | `src/components/QuarterCircle.css` | Blue quarter circle with plus - aligned to RIGHT EDGE of main content |
| 12 | Super Points Pill | `.left-red-pill` | `src/App.css` | Red pill with star (left side) - aligned to LEFT boundary |
| 13 | Red Circle Menu | `RedMenu` component | `src/components/RedMenu.jsx` | Red circle with eyes (bottom center) |
| 14 | Pause/Done Pill | `.right-green-pill` | `src/App.css` | Pink pill (pause/done button) |
| 15 | Pink ZigZag | `.zigzag-wrapper` | `src/App.css` | Pink zigzag character with eyes - aligned to RIGHT boundary |

## Content Boundaries

Based on the main centered content area (`.dumbledido-app` with `max-width: 800px`), the following CSS variables define content boundaries:

- `--content-area-margin: max(0px, calc((100vw - 800px) / 2))` - Margin on each side when content is centered
- `--content-left-boundary: calc(var(--content-area-margin) - 20px)` - 20px beyond left edge of content area
- `--content-right-boundary: calc(var(--content-area-margin) - 20px)` - 20px beyond right edge of content area

**How it works:**
- On screens **≤ 800px**: Content fills full width, boundaries are -20px from edges
- On screens **> 800px**: Content is centered (800px wide), boundaries are 20px beyond the content edges

**Elements aligned to LEFT boundary (index 10, 12):**
- Use `left: var(--content-left-boundary)` or relative calculations

**Elements aligned to RIGHT edge of main content (index 11):**
- Use `right: var(--content-area-margin)` to stick to the right edge

**Elements aligned to RIGHT boundary (index 15):**
- Use `right: var(--content-right-boundary)` for alignment (20px beyond content edge)

## Usage

When requesting changes like "move index 12 to align with index 15," this means:
- Modify the **actual UI object** (`.left-red-pill`)
- To align with the **actual UI object** (`ZigZag` component)
- The index markers themselves are just labels and remain fixed to their objects
