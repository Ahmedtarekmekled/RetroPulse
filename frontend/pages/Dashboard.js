import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalProjects: 0,
    totalMessages: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogs, projects, messages] = await Promise.all([
          axios.get('/api/blog/count'),
          axios.get('/api/projects/count'),
          axios.get('/api/contact/count')
        ]);

        setStats({
          totalBlogs: blogs.data.count,
          totalProjects: projects.data.count,
          totalMessages: messages.data.count
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Total Blog Posts</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalBlogs}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Total Projects</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalProjects}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Unread Messages</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalMessages}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 