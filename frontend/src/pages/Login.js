import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-8 border border-green-500">
        <div>
          <h2 className="text-center text-3xl font-mono text-green-500">
            Admin Access Required
          </h2>
        </div>
        {error && (
          <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="text-green-500 font-mono">
                &gt; Username_
              </label>
              <input
                id="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 mt-1 bg-black border border-green-500 text-green-500 font-mono focus:ring-0 focus:border-green-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-green-500 font-mono">
                &gt; Password_
              </label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 mt-1 bg-black border border-green-500 text-green-500 font-mono focus:ring-0 focus:border-green-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-green-500 text-green-500 font-mono hover:bg-green-500 hover:text-black transition-colors"
          >
            LOGIN_
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 