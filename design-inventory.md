# Family To-Do App - Design Inventory
**Complete UI Element Catalog**

---

## Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Buttons](#buttons)
4. [Icons & Emojis](#icons--emojis)
5. [Form Elements](#form-elements)
6. [UI Components](#ui-components)
7. [Visual Indicators](#visual-indicators)
8. [Timer & Progress Elements](#timer--progress-elements)
9. [Badges & Labels](#badges--labels)
10. [Layout Elements](#layout-elements)

---

## Color Palette

### Primary Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Purple Primary | `#667eea` | Primary gradient start, main buttons, headers |
| Purple Secondary | `#764ba2` | Primary gradient end |
| Green Success | `#10b981` | Done buttons, completed indicators, countdown timer |
| Green Countdown | `#65b032` | Countdown timer ring color |
| Overtime Start | `#d0ea2b` | First overtime ring (yellow-green) |
| Overtime End | `#a7194b` | Final overtime ring (pure red) |

### User Color Palette (Predefined)
| Color Name | Hex Code |
|------------|----------|
| Blue | `#3B82F6` |
| Green | `#10B981` |
| Pink | `#EC4899` |
| Orange | `#F59E0B` |
| Purple | `#8B5CF6` |
| Red | `#EF4444` |
| Cyan | `#06B6D4` |
| Dark Orange | `#F97316` |

### Overtime Gradient (10-minute progression)
| Minute | Hex Code | Color Description |
|--------|----------|-------------------|
| 0 | `#d0ea2b` | Yellow-green (starting overtime) |
| 1 | `#ead42b` | Yellow |
| 2 | `#eab72b` | Amber-yellow |
| 3 | `#ea9a2b` | Orange-yellow |
| 4 | `#ea7d2b` | Orange |
| 5 | `#ea5f2b` | Red-orange |
| 6 | `#ea422b` | Orange-red |
| 7 | `#de2b3a` | Red |
| 8 | `#cb2643` | Dark red |
| 9 | `#b9204b` | Darker red |
| 10+ | `#a7194b` | Pure red (maximum urgency) |

### Status Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Time Badge Background | `#e0e7ff` | Time indicator backgrounds |
| Time Badge Text | `#4f46e5` | Time indicator text |
| Recurrence Badge Background | `#fef3c7` | Recurrence indicator backgrounds |
| Recurrence Badge Text | `#d97706` | Recurrence indicator text |
| Completed Background | `#f0fdf4` | Completed task row background |
| Delete Button | `#EF4444` | Delete/cancel actions |
| Delete Hover | `#DC2626` | Delete button hover state |

### Neutral Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Background Light | `#f5f5f5` | Page background |
| Background Lighter | `#f9f9f9` | User selector background |
| Border Gray | `#999` | Dashed borders, inactive elements |
| Text Gray | `#666` | Secondary text, labels |
| Light Gray | `#e5e7eb` | Cancel buttons, inactive states |
| White | `#ffffff` | Cards, forms, button text |

### Super Point Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Super Point Start | `#f59e0b` | Super point button gradient start |
| Super Point End | `#f97316` | Super point button gradient end |

---

## Typography

### Font Family
- **Primary Font**: System default sans-serif stack
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif

### Font Sizes
| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Page Title | 28px | 700 | Main headings (h1) |
| Section Title | 24px | 600 | Form headers, section headers |
| Large Display | 56px | 700 | Timer countdown display |
| Overtime Display | 64px | 700 | Overtime timer display |
| Points Total | 48px | 700 | Points celebration total |
| Button Text | 18-24px | 600 | Primary action buttons |
| Body Text | 16px | 400 | Descriptions, labels |
| Small Text | 13-14px | 400 | Badges, helper text |
| User Name | 16px | 600 | User selector buttons |
| Points Display | 14px | 600 | User points counter |

### Special Typography
| Element | Style |
|---------|-------|
| Timer Display | `font-variant-numeric: tabular-nums` (monospaced numbers) |
| Overtime Label | `letter-spacing: 2px` |
| Celebration Header | 28px |

---

## Buttons

### Primary Buttons
| Button Name | Style | Colors | Size | Usage |
|-------------|-------|--------|------|-------|
| Start Button | Gradient, rounded | `#667eea` → `#764ba2` | 24px font, 18px padding | Start timer |
| Done Button | Solid, rounded | `#10b981` background | 20px font, 18px padding | Complete task |
| Save Button | Gradient, rounded | `#667eea` → `#764ba2` | 18px font, 16px padding | Save forms |
| Add Button (Floating) | Gradient, circular | `#667eea` → `#764ba2` | 60px diameter | Add new todo |

### Secondary Buttons
| Button Name | Style | Colors | Size | Usage |
|-------------|-------|--------|------|-------|
| Pause Button | Solid, rounded | `#f59e0b` background | 20px font, 18px padding | Pause timer |
| Cancel Button | Solid, rounded | `#e5e7eb` background | 18px font, 16px padding | Cancel forms |
| Super Point Button | Gradient, rounded | `#f59e0b` → `#f97316` | 16px font, 12px padding | Use super point |
| Back Button | Semi-transparent | `rgba(255,255,255,0.2)` | 18px font, 10px padding | Navigate back |

### Utility Buttons
| Button Name | Style | Colors | Size | Usage |
|-------------|-------|--------|------|-------|
| User Add Button | Dashed border | `#999` border/text | 24px font | Add new user |
| Close Button (×) | Text only | White text | 32px font | Close modals/forms |
| Edit Button (✏️) | Solid, small | Blue background | Icon only | Edit action |
| Delete Button (🗑️) | Solid, small | Red background | Icon only | Delete action |

### Button States
| State | Effect |
|-------|--------|
| Hover | Slight brightness increase |
| Active | `transform: scale(0.98)` |
| Disabled | Reduced opacity, no pointer |

### Schedule/Day Buttons
| Button Name | Style | Colors | Usage |
|-------------|-------|--------|-------|
| Active Schedule | Solid | `#667eea` background | Selected schedule option |
| Inactive Schedule | Outlined | Gray border | Unselected option |
| Active Day | Solid | `#667eea` background | Selected weekday |
| Inactive Day | Outlined | Gray border | Unselected weekday |

---

## Icons & Emojis

### Status Icons
| Icon | Unicode/Emoji | Usage | Location |
|------|---------------|-------|----------|
| Play | ▶️ | Running timer indicator | Todo list item |
| Pause | ⏸️ | Paused timer indicator | Todo list, detail buttons |
| Checkmark | ✓ | Completed status | Todo list, done buttons |
| Clock | ⏱️ | Time duration badge | Todo list |
| Repeat | 🔄 | Recurrence badge | Todo list |

### Action Icons
| Icon | Unicode/Emoji | Usage | Location |
|------|---------------|-------|----------|
| Pencil | ✏️ | Edit action | Swipe menu |
| Trash Can | 🗑️ | Delete action | Swipe menu, user form |
| Plus | + | Add new item | Add buttons |
| Left Arrow | ← | Navigate back | Detail header |
| Close | × | Close modal/form | Form headers |
| Star | ⭐ | Super points | User stats, super point button |

### Celebration Icons
| Icon | Unicode/Emoji | Usage | Location |
|------|---------------|-------|----------|
| Party Popper | 🎉 | Task completion | Points celebration |

### Week Calendar Icons
| Icon | Unicode/Emoji | Usage | Location |
|------|---------------|-------|----------|
| Checkmark | ✓ | Completed day | Week calendar |
| Circle | ○ | Incomplete day | Week calendar |
| Dash | - | Future day | Week calendar |

---

## Form Elements

### Input Fields
| Field Type | Styling | Placeholder Examples |
|------------|---------|---------------------|
| Text Input | Rounded, bordered | "Enter name", "What needs to be done?" |
| Number Input | Rounded, bordered | "e.g., 30" |
| Textarea | Rounded, bordered | "Add more details..." |
| Date Input | Rounded, bordered | Date picker |

### Input States
| State | Visual Feedback |
|-------|----------------|
| Focus | Border highlight |
| Required | Red asterisk (*) |
| Error | Red border, alert message |
| Disabled | Grayed out |

### Labels
| Element | Style |
|---------|-------|
| Field Label | 14px, gray text, margin-bottom |
| Required Indicator | Red asterisk (*) after label |

### Color Picker
| Element | Description |
|---------|-------------|
| Color Options | Circular buttons, 40px diameter |
| Active Color | Ring border around selected |
| Color Grid | 4 columns, wrap |

---

## UI Components

### User Selector
| Element | Description |
|---------|-------------|
| Container | Horizontal scroll, flex row |
| User Button | Rounded rectangle, colored background |
| User Name | 16px, white text |
| Points Display | 14px, points count |
| Super Points Display | Star emoji + count |
| Add User Button | Dashed border circle |

### Todo List Item
| Element | Description |
|---------|-------------|
| Container | White card, rounded, shadow |
| Title | 18px, bold |
| Time Badge | Rounded pill, purple background |
| Recurrence Badge | Rounded pill, amber background |
| Swipe Actions | Hidden until swiped left |
| Status Indicators | Icons on right side |

### Todo Detail View
| Element | Description |
|---------|-------------|
| Header | Purple gradient, back button |
| Title | 28px heading |
| Description | 16px gray text |
| Timer Circle | 280px diameter (240px mobile) |
| Timer Display | 56px tabular numbers |
| Timer Label | 16px below time |

### Week Calendar
| Element | Description |
|---------|-------------|
| Container | 7-day horizontal strip |
| Day Cell | Compact square |
| Day Label | Mon, Tue, Wed, etc. |
| Status Icon | ✓, ○, or - |
| Completed Day | Green background |
| Today | Border highlight |

### Forms (User & Todo)
| Element | Description |
|---------|-------------|
| Container | Modal overlay |
| Header | Purple gradient, title + close |
| Form Body | White background, padding |
| Form Groups | Labeled input sections |
| Button Row | Flex row, centered buttons |

---

## Visual Indicators

### Running Timer Indicator
- **Icon**: ▶️ (Play emoji)
- **Location**: Top-right of todo item
- **Color**: Orange/amber
- **Animation**: Pulsing animation

### Paused Timer Indicator
- **Icon**: ⏸️ (Pause emoji)
- **Location**: Top-right of todo item
- **Color**: Gray
- **Animation**: Static

### Completed Checkmark
- **Icon**: ✓
- **Location**: Right side of todo item
- **Background**: Green circle (#10b981)
- **Size**: 32px diameter

### Today Indicator (Week Calendar)
- **Style**: Border highlight
- **Color**: Primary purple

---

## Timer & Progress Elements

### Countdown Timer (Normal Time)
| Element | Description |
|---------|-------------|
| Ring Color | Green (#65b032) |
| Background | Light gray (#e5e7eb) |
| Progress | Conic gradient, decreasing |
| Text Color | Green (#65b032) |
| Label | "remaining" or "Time's up!" |
| Size | 280px diameter (240px mobile) |
| Ring Width | 12px stroke |

### Overtime Timer (SVG Rings)
| Element | Description |
|---------|-------------|
| Base Ring | Light gray (#e5e7eb), 12px stroke |
| Colored Rings | Overlapping SVG circles |
| Ring Width | 12px stroke (matching countdown) |
| Animation | Step-based (not smooth) |
| Text Color | Dark red (#a7194b) |
| Label | "OVERTIME" in uppercase |
| Progress | Each minute adds new ring |

### SVG Ring Properties
| Property | Value |
|----------|-------|
| ViewBox | 0 0 200 200 |
| Circle Center | cx="100" cy="100" |
| Circle Radius | r="85" |
| Stroke Width | 12 |
| Stroke Linecap | round |
| Transform | rotate(-90 100 100) |

### Progress Animation
- **Normal Time**: Smooth 1s transitions
- **Overtime**: Step-based jumps (no transition)
- **Direction**: Clockwise from top

---

## Badges & Labels

### Time Badge
- **Background**: `#e0e7ff`
- **Text Color**: `#4f46e5`
- **Icon**: ⏱️
- **Format**: "⏱️ MM:SS" or "N min"
- **Border Radius**: 12px
- **Font Size**: 13px

### Recurrence Badge
- **Background**: `#fef3c7`
- **Text Color**: `#d97706`
- **Icon**: 🔄
- **Format**: "🔄 Daily" or "🔄 Weekly"
- **Border Radius**: 12px
- **Font Size**: 13px

### Points Badge
- **Format**: "NNN pts"
- **Font Size**: 14px
- **Color**: Based on context

### Super Points Badge
- **Icon**: ⭐
- **Format**: "⭐N"
- **Font Size**: 14px
- **Color**: Gold/amber

---

## Layout Elements

### Page Header
- **Background**: Linear gradient `#667eea` → `#764ba2`
- **Height**: 80px
- **Padding**: 20px
- **Color**: White
- **Items**: Title, date picker, edit button

### Content Area
- **Background**: `#f5f5f5`
- **Padding**: 20-30px
- **Max Width**: 800px (centered)

### Modal Overlay
- **Background**: `rgba(0, 0, 0, 0.5)`
- **Position**: Fixed, full screen
- **Z-index**: High

### Form Container
- **Background**: White
- **Border Radius**: 16px
- **Shadow**: Medium elevation
- **Padding**: 20-30px
- **Max Width**: 500px

### Floating Action Button (FAB)
- **Position**: Fixed, bottom-right
- **Size**: 60px diameter
- **Background**: Gradient `#667eea` → `#764ba2`
- **Shadow**: Large elevation
- **Icon**: + (white, 24px)

### Swipe Actions
- **Edit Button**: Blue background, ✏️ icon
- **Delete Button**: Red background, 🗑️ icon
- **Width**: 80px each
- **Reveal**: On left swipe

---

## Points Celebration

### Celebration Modal
- **Background**: Gradient `#10b981` → `#059669`
- **Text Color**: White
- **Padding**: 40px 20px
- **Border Radius**: 16px
- **Animation**: Scale pulse (1 → 1.05 → 1)

### Points Breakdown
- **Total Display**: 48px bold
- **Details Background**: `rgba(255, 255, 255, 0.2)`
- **Detail Items**: 18px font
- **Bonus Color**: `#fef3c7` (light yellow)
- **Penalty Color**: `#fecaca` (light red)

---

## Confirmation Dialogs

### Delete Confirmation
- **Header Background**: Red (#EF4444)
- **Header Text**: White
- **Body Background**: White
- **Warning Icon**: 🗑️
- **Button Colors**: Red (confirm), Gray (cancel)

---

## Responsive Breakpoints

### Mobile (< 600px)
- Timer: 240px diameter
- Font sizes: Reduced by 10-15%
- Buttons: Slightly smaller padding
- Points total: 36px (vs 48px)

### Tablet/Desktop (≥ 600px)
- Timer: 280px diameter
- Full font sizes
- Standard padding
- Points total: 48px

---

## Animation Timings

| Element | Duration | Easing |
|---------|----------|--------|
| Button Hover | 0.2s | ease |
| Timer Ring (normal) | 1s | linear |
| Timer Ring (overtime) | none | step-based |
| Celebration Pulse | 1s | ease-in-out |
| Page Transitions | 0.3s | ease |
| Swipe Reveal | 0.3s | ease-out |

---

## Shadows & Elevation

| Level | Box Shadow |
|-------|------------|
| Low | `0 1px 3px rgba(0,0,0,0.1)` |
| Medium | `0 2px 10px rgba(0,0,0,0.1)` |
| High | `0 8px 20px rgba(0,0,0,0.15)` |

---

## Border Radius Standards

| Element | Radius |
|---------|--------|
| Small (badges) | 8px |
| Medium (buttons) | 12px |
| Large (cards) | 16px |
| Extra Large (modals) | 20px |
| Circular (user buttons) | 25px or 50% |

---

## Touch Target Sizes

| Element | Minimum Size |
|---------|-------------|
| Primary Buttons | 48px height |
| Icon Buttons | 44px × 44px |
| Swipe Actions | 80px width |
| List Items | 60px+ height |
| FAB | 60px diameter |

---

## Accessibility Features

### Color Contrast
- All text meets WCAG AA standards
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text

### Interactive Elements
- Minimum 44px touch targets
- Clear focus indicators
- Keyboard navigation support
- Screen reader labels

---

## Spacing System

| Size | Value | Usage |
|------|-------|-------|
| XS | 5px | Tight spacing |
| SM | 10px | Small gaps |
| MD | 15px | Standard gaps |
| LG | 20px | Large gaps |
| XL | 30px | Section spacing |
| XXL | 40-50px | Major sections |

---

## Summary Statistics

### Total UI Elements
- **Colors**: 30+ defined colors
- **Buttons**: 15+ button types
- **Icons/Emojis**: 15+ unique symbols
- **Form Elements**: 5 input types
- **Components**: 8 major components
- **Badges**: 4 badge types
- **Animations**: 6 animation types

### Design Principles
1. **Touch-First**: All elements optimized for touchscreen
2. **Color-Coded**: Visual feedback through color
3. **Gamified**: Points, streaks, and celebrations
4. **Responsive**: Mobile-first, scales up
5. **Accessible**: High contrast, clear targets
6. **Family-Friendly**: Simple, intuitive interface

---

*Document Generated: October 28, 2025*  
*Version: 1.0*  
*Application: Family To-Do App*
