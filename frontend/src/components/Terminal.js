import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/terminal.css';

function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [avatar] = useState(() => {
    return localStorage.getItem('terminalAvatar') || '🤖';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('terminalTheme') || 'matrix';
  });

  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const navigate = useNavigate();

  // Initialize terminal
  useEffect(() => {
    const initializeTerminal = () => {
      try {
        addSystemMessage();
        document.addEventListener('keydown', handleGlobalKeyPress);
      } catch (error) {
        console.error('Error initializing terminal:', error);
      }
    };

    initializeTerminal();

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress);
    };
  }, []);

  const handleGlobalKeyPress = (e) => {
    if (e.ctrlKey && e.key === '`') {
      setIsOpen(prev => !prev);
    }
  };

  const addSystemMessage = () => {
    const welcomeMessage = {
      type: 'system',
      content: `
[SYSTEM INITIALIZED - ${new Date().toLocaleString()}]
${avatar} Terminal v2.0 activated
----------------------------------
Type 'help' to see available commands
Press Ctrl + \` to toggle terminal
      `,
      avatar,
      animate: true
    };
    setOutput([welcomeMessage]);
  };

  // Define commands object before using it
  const commands = {
    help: () => ({
      type: 'info',
      content: `
Available commands:
  help        - Show this help message
  home        - Return to home page
  about       - Learn about me
  projects    - View my portfolio projects
  blog        - Read my blog posts
  contact     - Get in touch
  social      - View social links
  clear       - Clear the terminal
  theme       - Change terminal theme
  minimize    - Minimize terminal
  maximize    - Maximize terminal
  skills      - View my technical skills
  experience  - View my work experience
  education   - View my education
  easteregg   - ???
      `,
      avatar,
      animate: true
    }),

    home: () => {
      handleNavigation('/');
      return {
        type: 'success',
        content: 'Navigating to home page...',
        avatar,
        animate: true
      };
    },

    about: () => {
      handleNavigation('/about');
      return {
        type: 'success',
        content: 'Navigating to about page...',
        avatar,
        animate: true
      };
    },

    projects: () => {
      handleNavigation('/projects');
      return {
        type: 'success',
        content: 'Loading projects...',
        avatar,
        animate: true
      };
    },

    blog: () => {
      handleNavigation('/blog');
      return {
        type: 'success',
        content: 'Opening blog...',
        avatar,
        animate: true
      };
    },

    contact: () => {
      handleNavigation('/contact');
      return {
        type: 'success',
        content: 'Opening contact page...',
        avatar,
        animate: true
      };
    },

    clear: () => {
      setOutput([]);
      return null;
    },

    theme: (newTheme) => {
      if (['matrix', 'cyber', 'retro'].includes(newTheme)) {
        setTheme(newTheme);
        localStorage.setItem('terminalTheme', newTheme);
        return {
          type: 'success',
          content: `Theme changed to ${newTheme}`,
          avatar,
          animate: true
        };
      }
      return {
        type: 'error',
        content: 'Invalid theme. Available themes: matrix, cyber, retro',
        avatar
      };
    },

    minimize: () => {
      setIsMinimized(true);
      return {
        type: 'success',
        content: 'Terminal minimized',
        avatar,
        animate: true
      };
    },

    maximize: () => {
      setIsMinimized(false);
      return {
        type: 'success',
        content: 'Terminal maximized',
        avatar,
        animate: true
      };
    },

    skills: () => ({
      type: 'info',
      content: `
Technical Skills:
----------------
Frontend:
  - React, Vue.js, JavaScript
  - HTML5, CSS3, Tailwind CSS
  - TypeScript, Next.js

Backend:
  - Node.js, Express
  - Python, Django
  - RESTful APIs

Database:
  - MongoDB
  - PostgreSQL
  - MySQL

DevOps & Tools:
  - Git, GitHub
  - Docker
  - AWS
      `,
      avatar,
      animate: true
    }),

    experience: () => ({
      type: 'info',
      content: `
Work Experience:
---------------
[2023 - Present] Full Stack Developer
  - Building modern web applications
  - Leading technical projects
  - Mentoring junior developers

[2021 - 2023] Frontend Developer
  - Developed responsive web interfaces
  - Implemented UI/UX designs
  - Optimized application performance

[2019 - 2021] Web Developer
  - Created dynamic websites
  - Maintained client projects
  - Collaborated with design team
      `,
      avatar,
      animate: true
    }),

    education: () => ({
      type: 'info',
      content: `
Education:
----------
[2023] Master's in Computer Science
  - Specialization in Web Technologies
  - GPA: 3.8/4.0

[2019] Bachelor's in Computer Science
  - Focus on Software Engineering
  - GPA: 3.7/4.0

Certifications:
  - AWS Certified Developer
  - MongoDB Certified Developer
  - React Advanced Certification
      `,
      avatar,
      animate: true
    }),

    social: () => ({
      type: 'info',
      content: `
Social Links:
------------
Instagram: @ahmedtm_404
GitHub:    github.com/yourusername
LinkedIn:  linkedin.com/in/yourusername
Twitter:   @yourusername
      `,
      avatar,
      animate: true
    }),

    easteregg: () => ({
      type: 'special',
      content: `
Found the easter egg! 🎉
Try the 'matrix' command for a surprise...
      `,
      avatar,
      animate: true,
      glitch: true
    }),

    matrix: () => {
      document.body.classList.add('matrix-mode');
      setTimeout(() => {
        document.body.classList.remove('matrix-mode');
      }, 10000);
      return {
        type: 'special',
        content: 'Initiating Matrix mode...',
        avatar,
        animate: true,
        glitch: true
      };
    }
  };

  // Update handleCommand function
  const handleCommand = (command) => {
    try {
      const cmd = commands[command.toLowerCase()];
      if (cmd) {
        const result = cmd();
        if (result) {
          setOutput(prev => [...prev, {
            type: 'command',
            content: `> ${command}`,
            avatar
          }, result]);
        }
        // Add this: If it's a navigation command, minimize after a short delay
        if (['home', 'about', 'blog', 'projects', 'contact'].includes(command.toLowerCase())) {
          setTimeout(() => {
            setIsMinimized(true);
          }, 1000); // Delay to show the success message before minimizing
        }
        setCommandHistory(prev => [command, ...prev]);
        setHistoryIndex(-1);
      } else {
        setOutput(prev => [...prev, {
          type: 'error',
          content: `Command not found: ${command}`,
          avatar
        }]);
      }
    } catch (error) {
      console.error('Error executing command:', error);
      setOutput(prev => [...prev, {
        type: 'error',
        content: 'An error occurred while executing the command.',
        avatar
      }]);
    }
  };

  const handleKeyDown = (e) => {
    try {
      if (e.key === 'Enter') {
        e.preventDefault();
        const command = input.trim();
        if (command) {
          handleCommand(command);
          setInput('');
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInput('');
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const availableCommands = Object.keys(commands);
        const matchingCommands = availableCommands.filter(cmd => 
          cmd.startsWith(input.toLowerCase())
        );

        if (matchingCommands.length === 1) {
          setInput(matchingCommands[0]);
        } else if (matchingCommands.length > 1) {
          setOutput(prev => [...prev, {
            type: 'info',
            content: `Available commands:\n${matchingCommands.join(', ')}`,
            avatar,
            animate: true
          }]);
        }
      }
    } catch (error) {
      console.error('Error handling key press:', error);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Add useEffect to handle terminal activation
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const terminalWindow = document.querySelector('.terminal-window');
        if (terminalWindow) {
          terminalWindow.classList.add('active');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Update the click handler
  const toggleTerminal = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setIsMinimized(false); // Reset minimized state when opening
    }
  };

  // Navigation handler
  const handleNavigation = (path) => {
    setIsMinimized(true); // Minimize before navigation
    navigate(path);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleTerminal}
        className="terminal-button"
        aria-label="Toggle Terminal"
      >
        <span className="terminal-avatar">{avatar}</span>
        <span>{isOpen ? '[-]' : '[+]'}</span>
      </button>

      {isOpen && (
        <div 
          className={`terminal-window ${theme} ${isOpen ? 'active' : ''}`}
          style={{ 
            maxWidth: '90vw',
            maxHeight: '80vh',
            width: '24rem',
            height: '32rem'
          }}
        >
          <div className="terminal-header">
            <span className="terminal-title">
              {avatar} terminal@portfolio:~
            </span>
            <div className="terminal-controls">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                className="minimize-button"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="close-button"
              />
            </div>
          </div>

          {!isMinimized && (
            <div className="terminal-content" ref={outputRef}>
              {output.map((line, i) => (
                <pre
                  key={i}
                  className={`terminal-line ${line.type} ${line.animate ? 'animate' : ''}`}
                >
                  {line.avatar && <span className="terminal-avatar">{line.avatar}</span>}
                  {line.content}
                </pre>
              ))}
              
              <div className="terminal-input">
                <span className="terminal-avatar">{avatar}</span>
                <span className="terminal-prompt">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="terminal-input-field"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Terminal; 