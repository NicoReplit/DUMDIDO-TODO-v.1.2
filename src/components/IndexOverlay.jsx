import './IndexOverlay.css';

export default function IndexOverlay() {
  const indexes = [
    // Header elements - top to bottom, left to right
    { id: 1, label: 'App Name (DUMDIDO-THE-DO)', top: '3vh', left: '50%', transform: 'translateX(-50%)' },
    { id: 2, label: 'Familien-Aufgabenliste Text', top: '10vh', left: 'max(20%, 260px)' },
    { id: 3, label: 'Calendar Date Display', top: '8vh', right: 'max(2%, 30px)' },
    { id: 4, label: 'White Background Box', top: '7vh', left: '50%', transform: 'translateX(-50%)' },
    { id: 5, label: 'Blue Line Separator', top: '15vh', left: '50%', transform: 'translateX(-50%)' },
    
    // Main content area
    { id: 6, label: 'User Selection Buttons', top: 'max(20vh, 155px)', left: '50%', transform: 'translateX(-50%)' },
    { id: 7, label: 'Progress Bar with Points', top: 'max(28vh, 230px)', left: '50%', transform: 'translateX(-50%)' },
    { id: 8, label: 'Week Calendar', top: 'max(35vh, 285px)', left: '50%', transform: 'translateX(-50%)' },
    { id: 9, label: 'Todo List Area', top: 'max(45vh, 370px)', left: '50%', transform: 'translateX(-50%)' },
    
    // Bottom UI elements - left to right
    { id: 10, label: 'Blue Circle (Left Bottom)', bottom: '2vmin', left: '2vmin' },
    { id: 11, label: 'Blue Plus Button (Quarter Circle)', top: '1.5vmin', left: '1.5vmin' },
    { id: 12, label: 'Left Red Pill (Super Points)', bottom: '15vmin', left: '1.5vmin' },
    { id: 13, label: 'Red Circle Menu (Bottom Center)', bottom: '2vmin', left: '50%', transform: 'translateX(-50%)' },
    { id: 14, label: 'Right Pink Pill (Pause/Done)', bottom: '15vmin', right: 'calc(50px + 260px * 1.1 * 0.766)' },
    { id: 15, label: 'Pink ZigZag Character', bottom: '2vmin', right: 'calc(-50px + 260px * 1.1)' },
  ];

  return (
    <div className="index-overlay">
      {indexes.map(index => (
        <div 
          key={index.id}
          className="index-marker"
          style={{
            top: index.top,
            bottom: index.bottom,
            left: index.left,
            right: index.right,
            transform: index.transform
          }}
          title={index.label}
        >
          {index.id}
        </div>
      ))}
    </div>
  );
}
