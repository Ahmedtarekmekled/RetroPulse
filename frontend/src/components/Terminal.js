import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/terminal.css';
import api from '../utils/axios';

function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [avatar] = useState(() => {
    return localStorage.getItem('terminalAvatar') || '🤖';
  });
  const [theme] = useState(() => {
    return localStorage.getItem('terminalTheme') || 'matrix';
  });
  const [socialLinks, setSocialLinks] = useState([]);
  const [educationInfo, setEducationInfo] = useState([]);
  const [skillsInfo, setSkillsInfo] = useState([]);
  const [experienceInfo, setExperienceInfo] = useState([]);

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
Press Ctrl + \` to toggle terminal.
      `,
      avatar,
      animate: true
    };
    setOutput([welcomeMessage]);
  };

  // Add this effect to fetch data when terminal is initialized
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [socialRes, aboutRes] = await Promise.all([
          api.get('/api/social'),
          api.get('/api/about')
        ]);

        setSocialLinks(socialRes.data);
        
        // Organize about sections
        const aboutSections = aboutRes.data;
        setEducationInfo(aboutSections.filter(s => s.section === 'EDUCATION'));
        setSkillsInfo(aboutSections.filter(s => s.section === 'TECHNICAL_EXPERTISE'));
        setExperienceInfo(aboutSections.filter(s => s.section === 'CAREER_TIMELINE'));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
  skills      - View my technical skills
  experience  - View my work experience
  education   - View my education
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
      return {
        type: 'success',
        content: 'Terminal minimized',
        avatar,
        animate: true
      };
    },

    maximize: () => {
      return {
        type: 'success',
        content: 'Terminal maximized',
        avatar,
        animate: true
      };
    },

    social: () => {
      if (socialLinks.length === 0) {
        return {
          type: 'error',
          content: 'No social links available.',
          avatar
        };
      }

      return {
        type: 'info',
        content: `
Social Links:
------------
${socialLinks.map(link => `${link.platform}: ${link.url}`).join('\n')}
        `,
        avatar,
        animate: true
      };
    },

    education: () => {
      if (educationInfo.length === 0) {
        return {
          type: 'error',
          content: 'Education information not available.',
          avatar
        };
      }

      return {
        type: 'info',
        content: `
Education:
----------
${educationInfo.map(edu => edu.content).join('\n------------')}
        `,
        avatar,
        animate: true
      };
    },

    skills: () => {
      if (skillsInfo.length === 0) {
        return {
          type: 'error',
          content: 'Skills information not available.',
          avatar
        };
      }

      return {
        type: 'info',
        content: `
Technical Skills:
----------------
${skillsInfo.map(skill => skill.content).join('\n------------')}
        `,
        avatar,
        animate: true
      };
    },

    experience: () => {
      if (experienceInfo.length === 0) {
        return {
          type: 'error',
          content: 'Experience information not available.',
          avatar
        };
      }

      return {
        type: 'info',
        content: `
Work Experience:
---------------
${experienceInfo.map(exp => exp.content).join('\n------------')}
        `,
        avatar,
        animate: true
      };
    },

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
    },

    login: () => {
      handleNavigation('/login');
      return {
        type: 'success',
        content: 'Accessing secure login portal...',
        avatar,
        animate: true
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

        // Close terminal after a short delay for navigation commands
        if (['home', 'about', 'blog', 'projects', 'contact', 'login'].includes(command.toLowerCase())) {
          setTimeout(() => {
            setIsOpen(false);
          }, 800);
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
  };

  // Navigation handler
  const handleNavigation = (path) => {
    setIsOpen(false); // Close terminal on navigation
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
                  setIsOpen(false);
                }}
                className="close-button"
              />
            </div>
          </div>

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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="terminal-input-field"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Terminal; 