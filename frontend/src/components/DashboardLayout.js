import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-black text-green-500 font-mono">
      {/* Sidebar */}
      <aside className={`w-64 border-r border-green-500 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-4">
          <h2 className="text-xl font-semibold border-b border-green-500 pb-2">Admin Panel_</h2>
          <nav className="mt-8 space-y-2">
            <Link to="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-500 hover:text-black">
              &gt; Overview
            </Link>
            <Link to="/dashboard/blogs" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-500 hover:text-black">
              &gt; Blog Posts
            </Link>
            <Link to="/dashboard/projects" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-500 hover:text-black">
              &gt; Projects
            </Link>
            <Link to="/dashboard/messages" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-500 hover:text-black">
              &gt; Messages
            </Link>
            {user.role === 'admin' && (
              <Link to="/dashboard/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-500 hover:text-black">
                &gt; Users
              </Link>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-green-500">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-green-500 hover:text-black"
            >
              Menu_
            </button>
            <div className="flex items-center">
              <span className="mr-4">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
              >
                Logout_
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout; 