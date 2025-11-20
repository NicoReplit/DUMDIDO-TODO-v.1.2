import './IndexOverlay.css';

export default function IndexOverlay() {
  const indexes = [
    // Header elements - top to bottom, left to right
    { id: 1, label: 'App Name (DUMDIDO-THE-DO)', top: '3vh', left: '50%', transform: 'translate(-50%, -50%)' },
    { id: 2, label: 'Familien-Aufgabenliste Text', top: '10vh', left: 'max(20%, 260px)', transform: 'translateY(-50%)' },
    { id: 3, label: 'Calendar Date Display', top: '8vh', right: 'max(5%, 100px)', transform: 'translateY(-50%)' },
    { id: 4, label: 'White Background Box', top: '7vh', left: '50%', transform: 'translate(-50%, -50%)' },
    { id: 5, label: 'Blue Line Separator', top: '15vh', left: '50%', transform: 'translate(-50%, -50%)' },
    
    // Main content area
    { id: 6, label: 'User Selection Buttons', top: 'max(20vh, 155px)', left: '50%', transform: 'translate(-50%, -50%)' },
    { id: 7, label: 'Progress Bar with Points', top: 'max(28vh, 230px)', left: '50%', transform: 'translate(-50%, -50%)' },
    { id: 8, label: 'Week Calendar', top: 'max(35vh, 285px)', left: '50%', transform: 'translate(-50%, -50%)' },
    { id: 9, label: 'Todo List Area', top: 'max(45vh, 370px)', left: '50%', transform: 'translate(-50%, -50%)' },
    
    // Bottom UI elements - left to right
    { id: 10, label: 'Blue Circle (Left Bottom)', bottom: 'calc(2vmin + 24vmin)', left: 'calc(2vmin + 24vmin)', transform: 'translate(-50%, 50%)' },
    { id: 11, label: 'Blue Plus Button (Quarter Circle)', bottom: '30px', right: '30px', transform: 'translate(50%, 50%)' },
    { id: 12, label: 'Left Red Pill (Super Points)', bottom: 'calc(15vmin + 45px)', left: 'calc(1.5vmin + 45px)', transform: 'translate(-50%, 50%)' },
    { id: 13, label: 'Red Circle Menu (Bottom Center)', bottom: 'calc(2vmin + 24vmin)', left: '50%', transform: 'translate(-50%, 50%)' },
    { id: 14, label: 'Right Pink Pill (Pause/Done)', bottom: 'calc(15vmin + 45px)', right: 'calc(50px + 260px * 1.1 * 0.766 - 45px)', transform: 'translate(50%, 50%)' },
    { id: 15, label: 'Pink ZigZag Character', bottom: 'calc(2vmin + 130px)', right: 'calc(-50px + 260px * 1.1 * 0.5)', transform: 'translate(50%, 50%)' },
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
