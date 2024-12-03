import { useState, useEffect } from 'react';

console.log('DynamicText component loaded');

export const DynamicText = ({ text, initialSize = 'medium', withPoints = false, glitch = false, typewriter = false }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(typewriter);

  useEffect(() => {
    if (typewriter) {
      setDisplayText('');
      setIsTyping(true);
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayText(prev => prev + text[index]);
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    } else {
      setDisplayText(text);
    }
  }, [text, typewriter]);

  return (
    <span 
      className={`
        dynamic-text
        ${initialSize} 
        ${withPoints ? 'with-points' : ''} 
        ${glitch ? 'glitch' : ''}
        ${isTyping ? 'typing' : ''}
      `}
    >
      {displayText}
    </span>
  );
};

export default DynamicText; 