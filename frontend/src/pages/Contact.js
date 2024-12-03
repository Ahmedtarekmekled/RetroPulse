import { useState, useEffect } from 'react';
import api from '../utils/axios';
import DynamicText from '../components/DynamicText';
import HackerBackground from '../components/HackerBackground';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await api.get('/api/social');
      setSocialLinks(response.data.filter(link => link.isActive));
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/contact', formData);
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('Error sending message. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-black">
      <HackerBackground type="glitch" />
      <div className="relative z-10">
        <div className="min-h-screen bg-black text-green-500 font-mono p-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="border border-green-500 p-4 mb-6">
              <h1 className="text-2xl font-bold mb-2">
                <DynamicText text="SECURE COMMUNICATION CHANNEL" typewriter={true} />
              </h1>
              <p className="text-sm text-green-400">
                [ENCRYPTION: ENABLED]
                <br />
                [CONNECTION: SECURE]
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border border-green-500 p-4">
                <div className="mb-6">
                  <label className="block text-sm mb-2">&gt; Identify yourself:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black border border-green-500 p-2 text-green-500 focus:border-green-400 focus:outline-none"
                    required
                    placeholder="ENTER_NAME"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-2">&gt; Communication channel:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black border border-green-500 p-2 text-green-500 focus:border-green-400 focus:outline-none"
                    required
                    placeholder="ENTER_EMAIL"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-2">&gt; Enter your message:</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full h-32 bg-black border border-green-500 p-2 text-green-500 focus:border-green-400 focus:outline-none resize-none"
                    required
                    placeholder="TYPE_MESSAGE"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`border border-green-500 px-4 py-2 hover:bg-green-500 hover:text-black transition-colors ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'SENDING...' : 'SEND_MESSAGE'}
                  </button>

                  {status && (
                    <span className={status.includes('Error') ? 'text-red-500' : 'text-green-400'}>
                      {status}
                    </span>
                  )}
                </div>
              </div>
            </form>

            {/* Alternative Contact Methods */}
            <div className="mt-8 border border-green-500 p-4">
              <h2 className="text-lg font-bold mb-4">&gt; Alternative Channels:</h2>
              <div className="space-y-3">
                {socialLinks.map((link) => (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-green-400 transition-colors"
                  >
                    <i className={`${link.icon} w-6`}></i>
                    <span>&gt; {link.label || link.platform}: {link.url}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* ASCII Art */}
            <div className="mt-8 text-center text-xs">
              <pre className="inline-block text-left">
{`
    _____            _             _   
   / ____|          | |           | |  
  | |     ___  _ __ | |_ __ _  ___| |_ 
  | |    / _ \\| '_ \\| __/ _\` |/ __| __|
  | |___| (_) | | | | || (_| | (__| |_ 
   \\_____\\___/|_| |_|\\__\\__,_|\\___|\\__|
                                       
`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact; 