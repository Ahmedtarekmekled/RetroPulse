import { Link } from 'react-router-dom';
import HackerBackground from '../components/HackerBackground';

function NotFound() {
  return (
    <div className="relative min-h-screen bg-black text-red-500 font-mono flex flex-col items-center justify-center p-4">
      <HackerBackground type="static" />
      
      <div className="glitch-container mb-8 relative">
        <h1 className="text-6xl md:text-8xl font-bold glitch-text" data-text="ERROR 404">
          ERROR 404
        </h1>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="glitch-scanline"></div>
        </div>
      </div>

      <div className="text-center space-y-4 mb-8 relative">
        <p className="text-2xl">
          <span className="animate-pulse">&gt;</span> SYSTEM MALFUNCTION
        </p>
        <p className="text-lg text-green-400">
          FILE_NOT_FOUND: The requested data has been corrupted or deleted.
        </p>
        <div className="error-box border border-red-500 p-4 mt-4 relative overflow-hidden">
          <div className="glitch-blocks"></div>
          <p className="text-sm">
            CRITICAL_ERROR: Memory address 0x404 cannot be accessed.
            <br />
            SUGGESTION: Return to safe sector or contact system administrator.
          </p>
        </div>
      </div>

      <div className="space-y-4 relative">
        <Link 
          to="/" 
          className="block px-6 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-all transform hover:scale-105"
        >
          &gt; RETURN_TO_MAINFRAME_
        </Link>
        
        <a 
          href="https://instagram.com/ahmedtm_404" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block px-6 py-2 border border-purple-500 hover:bg-purple-500 hover:text-black transition-all transform hover:scale-105"
        >
          <i className="fab fa-instagram mr-2"></i>
          CONNECT_@ahmedtm_404
        </a>
      </div>

      <div className="mt-12 text-xs relative">
        <pre className="text-red-500 animate-pulse">
{`
    _____                     _  _    ___  _  _   
   | ____|_ __ _ __ ___  _ __| || |  / _ \\| || |  
   |  _| | '__| '__/ _ \\| '__| || |_| | | | || |_ 
   | |___| |  | | | (_) | |  |__   _| |_| |__   _|
   |_____|_|  |_|  \\___/|_|     |_|  \\___/   |_|  
`}
        </pre>
      </div>
    </div>
  );
}

export default NotFound; 