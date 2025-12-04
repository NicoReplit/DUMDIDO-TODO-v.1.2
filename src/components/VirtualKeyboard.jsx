import { useState, useEffect, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './VirtualKeyboard.css';

function VirtualKeyboard({ onKeyboardInput, onClose }) {
  const [layoutName, setLayoutName] = useState('default');
  const [inputValue, setInputValue] = useState('');
  const keyboardRef = useRef(null);

  const onKeyPress = (button) => {
    if (button === '{shift}' || button === '{lock}') {
      setLayoutName(layoutName === 'default' ? 'shift' : 'default');
      return;
    }
    
    if (button === '{enter}') {
      if (onClose) onClose();
      return;
    }
    
    if (button === '{bksp}') {
      if (onKeyboardInput) {
        onKeyboardInput('backspace');
      }
      return;
    }
    
    if (button === '{space}') {
      if (onKeyboardInput) {
        onKeyboardInput(' ');
      }
      return;
    }
    
    if (onKeyboardInput) {
      onKeyboardInput(button);
    }
  };

  const onChange = (input) => {
    setInputValue(input);
  };

  // Prevent focus loss when clicking keyboard
  const handleMouseDown = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      className="virtual-keyboard-container"
      onMouseDown={handleMouseDown}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="keyboard-header">
        <span className="keyboard-title">Tastatur</span>
        <button className="keyboard-close-btn" onClick={onClose}>
          <img src="/Close.svg" alt="Close" className="close-icon" />
        </button>
      </div>
      <Keyboard
        keyboardRef={r => (keyboardRef.current = r)}
        layoutName={layoutName}
        onChange={onChange}
        onKeyPress={onKeyPress}
        layout={{
          default: [
            '1 2 3 4 5 6 7 8 9 0 {bksp}',
            'q w e r t z u i o p ü',
            'a s d f g h j k l ö ä',
            '{shift} y x c v b n m , . {shift}',
            '{space}'
          ],
          shift: [
            '! " § $ % & / ( ) = {bksp}',
            'Q W E R T Z U I O P Ü',
            'A S D F G H J K L Ö Ä',
            '{shift} Y X C V B N M ; : {shift}',
            '{space}'
          ]
        }}
        display={{
          '{bksp}': '⌫',
          '{enter}': '↵',
          '{shift}': '⇧',
          '{space}': ' ',
          '{lock}': '⇪'
        }}
        theme="hg-theme-default dumbledido-keyboard"
      />
    </div>
  );
}

export default VirtualKeyboard;
