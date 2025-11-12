import React, { useMemo } from 'react';
import './Confetti.css';

const Confetti = ({ isActive }) => {
  const confettiPieces = useMemo(() => {
    // DUMBLEDIDO color palette (excluding gray/black/white for vibrant confetti)
    const colors = ['#FECE00', '#0061EE', '#FF006E', '#EE4100', '#38D247', '#FEBA00', '#FF77B9', '#EE00AE'];
    const pieces = [];
    const count = 25;

    for (let i = 0; i < count; i++) {
      pieces.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
        size: 10 + Math.random() * 20,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1.5,
        rotation: Math.random() * 360,
      });
    }

    return pieces;
  }, []);

  if (!isActive) return null;

  return (
    <div className="confetti-container">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            backgroundColor: piece.color,
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
