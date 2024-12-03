import { useState, useEffect } from 'react';
import api from '../utils/axios';
import DynamicText from '../components/DynamicText';
import HackerBackground from '../components/HackerBackground';

function About() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (sections.length > 0) {
      const timer = setInterval(() => {
        setCurrentSection(prev => (prev + 1) % sections.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [sections]);

  const fetchSections = async () => {
    try {
      const response = await api.get('/api/about');
      setSections(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sections:', error);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      <HackerBackground type="circuit" />
      <div className="relative z-10">
        <div className="min-h-screen bg-black text-green-500 font-mono p-4">
          <div className="max-w-4xl mx-auto">
            <div className="border border-green-500 p-4 mb-6">
              <h1 className="text-2xl font-bold mb-2">
                <DynamicText text="PERSONNEL FILE: AHMED MEKLED" typewriter={true} />
              </h1>
              <p className="text-sm text-green-400">
                [SECURITY LEVEL: PUBLIC]
                <br />
                [LAST UPDATED: {new Date().toLocaleDateString()}]
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className={`border border-green-500 p-4 transition-all duration-500 ${
                      loading ? 'opacity-0 transform translate-y-4' : 'opacity-100'
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <h2 className="text-xl font-semibold mb-4">&gt; {section.title}</h2>
                    <pre className="whitespace-pre-wrap text-sm">{section.content}</pre>
                  </div>
                ))}
              </div>

              <div className="border border-green-500 p-4 bg-black">
                <div className="flex justify-between items-center mb-4 border-b border-green-500 pb-2">
                  <span>terminal@portfolio:~</span>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="h-[600px] overflow-y-auto terminal-output">
                  <div className="space-y-2">
                    <p>&gt; Loading profile data...</p>
                    <p>&gt; Accessing secure database...</p>
                    <p>&gt; Decrypting personnel file...</p>
                    <div className="mt-4">
                      <p className="text-yellow-500">[DISPLAYING CURRENT FOCUS]</p>
                      <pre className="mt-2 text-green-400 whitespace-pre-wrap">
                        {sections[currentSection]?.content || 'Loading...'}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-xs">
              <pre className="inline-block text-left">
{`
    _    _                           _ 
   / \\  | |__  _ __ ___   ___  __| |
  / _ \\ | '_ \\| '_ \` _ \\ / _ \\/ _\` |
 / ___ \\| | | | | | | | |  __/ (_| |
/_/   \\_\\_| |_|_| |_| |_|\\___|\\__,_|
`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 