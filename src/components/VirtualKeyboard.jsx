import { useState, useEffect, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './VirtualKeyboard.css';

function VirtualKeyboard({ onKeyboardInput, onClose, inputType }) {
  const [layoutName, setLayoutName] = useState('default');
  const [isShift, setIsShift] = useState(false);
  const [showNumbers, setShowNumbers] = useState(inputType === 'number');
  const keyboardRef = useRef(null);

  useEffect(() => {
    setShowNumbers(inputType === 'number');
  }, [inputType]);

  const onKeyPress = (button) => {
    if (button === '{shift}') {
      setIsShift(!isShift);
      setLayoutName(isShift ? 'default' : 'shift');
      return;
    }
    
    if (button === '{numbers}') {
      setShowNumbers(true);
      return;
    }
    
    if (button === '{abc}') {
      setShowNumbers(false);
      return;
    }
    
    if (button === '{enter}') {
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
    
    if (isShift && !showNumbers) {
      setIsShift(false);
      setLayoutName('default');
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
  };

  const numberLayout = {
    default: [
      '1 2 3',
      '4 5 6',
      '7 8 9',
      '{abc} 0 {bksp}'
    ]
  };

  const characterLayout = {
    default: [
      'q w e r t z u i o p ü {bksp}',
      'a s d f g h j k l ö ä',
      '{shift} y x c v b n m {shift}',
      '{numbers} {space} {enter}'
    ],
    shift: [
      'Q W E R T Z U I O P Ü {bksp}',
      'A S D F G H J K L Ö Ä',
      '{shift} Y X C V B N M {shift}',
      '{numbers} {space} {enter}'
    ]
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
      {showNumbers ? (
        <Keyboard
          keyboardRef={r => (keyboardRef.current = r)}
          layoutName="default"
          onKeyPress={onKeyPress}
          layout={numberLayout}
          display={{
            '{bksp}': '⌫',
            '{abc}': 'ABC'
          }}
          theme="hg-theme-default dumbledido-keyboard number-keyboard"
        />
      ) : (
        <Keyboard
          keyboardRef={r => (keyboardRef.current = r)}
          layoutName={layoutName}
          onKeyPress={onKeyPress}
          layout={characterLayout}
          display={{
            '{bksp}': '⌫',
            '{enter}': '↵',
            '{shift}': isShift ? '⇧' : '⇧',
            '{space}': ' ',
            '{numbers}': '123'
          }}
          buttonTheme={[
            {
              class: isShift ? 'shift-active' : '',
              buttons: '{shift}'
            }
          ]}
          theme="hg-theme-default dumbledido-keyboard"
        />
      )}
    </div>
  );
}

export default VirtualKeyboard;
