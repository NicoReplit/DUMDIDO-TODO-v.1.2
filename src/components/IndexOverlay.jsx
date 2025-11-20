import './IndexOverlay.css';

export default function IndexOverlay() {
  const indexes = [
    // Header elements - top to bottom, left to right
    { id: 1, label: 'App Name (DUMDIDO-THE-DO)', top: '25px', left: '50%', transform: 'translateX(-50%)' },
    { id: 2, label: 'Familien-Aufgabenliste Text', top: '75px', left: '270px' },
    { id: 3, label: 'Calendar Date Display', top: '65px', right: '30px' },
    { id: 4, label: 'White Background Box', top: '55px', left: '50%', transform: 'translateX(-50%)' },
    { id: 5, label: 'Blue Line Separator', top: '115px', left: '50%', transform: 'translateX(-50%)' },
    
    // Main content area
    { id: 6, label: 'User Selection Buttons', top: '155px', left: '50%', transform: 'translateX(-50%)' },
    { id: 7, label: 'Progress Bar with Points', top: '230px', left: '50%', transform: 'translateX(-50%)' },
    { id: 8, label: 'Week Calendar', top: '285px', left: '50%', transform: 'translateX(-50%)' },
    { id: 9, label: 'Todo List Area', top: '370px', left: '50%', transform: 'translateX(-50%)' },
    
    // Bottom UI elements - left to right
    { id: 10, label: 'Blue Circle (Left Bottom)', bottom: '20px', left: '20px' },
    { id: 11, label: 'Blue Plus Button (Quarter Circle)', top: '10px', left: '10px' },
    { id: 12, label: 'Left Red Pill (Super Points)', bottom: '120px', left: '10px' },
    { id: 13, label: 'Red Circle Menu (Bottom Center)', bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
    { id: 14, label: 'Right Pink Pill (Pause/Done)', bottom: '120px', right: '246px' },
    { id: 15, label: 'Pink ZigZag Character', bottom: '20px', right: '60px' },
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
