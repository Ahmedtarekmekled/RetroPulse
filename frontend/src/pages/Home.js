import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicText from '../components/DynamicText';

function Home() {
  const [glitchText, setGlitchText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const texts = [
      'SYSTEM BREACH DETECTED...',
      'INITIALIZING NEURAL INTERFACE...',
      'ACCESSING MAINFRAME...',
      'WELCOME TO THE MATRIX'
    ];
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;

    const type = () => {
      const fullText = texts[currentIndex];
      
      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
      }

      setGlitchText(currentText);

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && currentText === fullText) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % texts.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    };

    type();

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    const charArray = chars.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (command) => {
    switch(command.toLowerCase()) {
      case 'about':
        navigate('/about');
        break;
      case 'projects':
        navigate('/projects');
        break;
      case 'blog':
        navigate('/blog');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'instagram':
        window.open('https://instagram.com/ahmedtm_404', '_blank');
        break;
      default:
        // Handle invalid command
        break;
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-green-500 font-mono overflow-hidden">
      {/* Matrix rain background */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full opacity-50" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Glitch effect container */}
        <div className="glitch-container mb-8 min-h-[120px]">
          <h1 className="text-4xl md:text-6xl font-bold glitch-text mb-4">
            <DynamicText text="TERMINAL" glitch={true} />
          </h1>
          <div className="text-xl md:text-2xl text-green-400 mb-8 min-h-[32px]">
            {glitchText}{showCursor ? '_' : ' '}
          </div>
        </div>

        {/* Command menu */}
        <div className="border border-green-500 p-6 max-w-md w-full bg-black bg-opacity-90 backdrop-blur-sm">
          <div className="mb-4 flex justify-between items-center">
            <span>root@terminal:~#</span>
            <span className="text-sm">{new Date().toLocaleString()}</span>
          </div>

          <div className="space-y-2">
            {['about', 'projects', 'blog', 'contact'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleCommand(cmd)}
                className="w-full text-left px-4 py-2 hover:bg-green-500 hover:text-black transition-colors"
              >
                &gt; {cmd.toUpperCase()}_
              </button>
            ))}
          </div>
        </div>

        {/* Social links */}
        <div className="mt-8 flex space-x-4">
          <a
            href="https://instagram.com/ahmedtm_404"
            target="_blank"
            rel="noopener noreferrer"
            className="glitch-link"
          >
            <i className="fab fa-instagram mr-2"></i>
            @ahmedtm_404
          </a>
        </div>

        {/* ASCII art */}
        <div className="mt-8 text-xs">
          <pre className="text-green-500">
{`
    _____                    _             _ 
   |_   _|__ _ __ _ __ ___ (_)_ __   __ _| |
     | |/ _ \\ '__| '_ \` _ \\| | '_ \\ / _\` | |
     | |  __/ |  | | | | | | | | | | (_| | |
     |_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|
`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default Home; 