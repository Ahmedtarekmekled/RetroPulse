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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`w-64 bg-white shadow-md ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <nav className="mt-8">
            <Link to="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100">
              Overview
            </Link>
            <Link to="/dashboard/blogs" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100">
              Blog Posts
            </Link>
            <Link to="/dashboard/projects" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100">
              Projects
            </Link>
            <Link to="/dashboard/messages" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100">
              Messages
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2"
            >
              Menu
            </button>
            <div className="flex items-center">
              <span className="mr-4">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout; 