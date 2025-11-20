import './IndexOverlay.css';

export default function IndexOverlay() {
  const indexes = [
    // Top to bottom, left to right
    { id: 1, label: 'Quarter Circle (Add Button)', top: '10px', left: '10px' },
    { id: 2, label: 'User Selection Buttons', top: '155px', left: '50%', transform: 'translateX(-50%)' },
    { id: 3, label: 'Progress Bar with Points', top: '230px', left: '50%', transform: 'translateX(-50%)' },
    { id: 4, label: 'Week Calendar', top: '285px', left: '50%', transform: 'translateX(-50%)' },
    { id: 5, label: 'Todo List Area', top: '370px', left: '50%', transform: 'translateX(-50%)' },
    { id: 6, label: 'Left Red Pill (Super Points)', bottom: '120px', left: '10px' },
    { id: 7, label: 'Red Circle Menu (Bottom Center)', bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
    { id: 8, label: 'Right Pink Pill (Pause/Done)', bottom: '120px', right: '246px' },
    { id: 9, label: 'Pink ZigZag Character', bottom: '20px', right: '60px' },
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
