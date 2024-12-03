import { Link } from 'react-router-dom';
import DynamicText from '../components/DynamicText';
import VisitHistory from '../components/VisitHistory';

function Dashboard() {
  const menuItems = [
    {
      title: 'Blog Posts',
      path: '/dashboard/blogs',
      icon: 'fas fa-blog',
      description: 'Manage your blog posts'
    },
    {
      title: 'Projects',
      path: '/dashboard/projects',
      icon: 'fas fa-project-diagram',
      description: 'Manage your projects'
    },
    {
      title: 'Messages',
      path: '/dashboard/messages',
      icon: 'fas fa-envelope',
      description: 'View contact messages'
    },
    {
      title: 'Users',
      path: '/dashboard/users',
      icon: 'fas fa-users',
      description: 'Manage user accounts'
    },
    {
      title: 'About Sections',
      path: '/dashboard/about',
      icon: 'fas fa-user-edit',
      description: 'Edit about page sections'
    },
    {
      title: 'Social Links',
      path: '/dashboard/social',
      icon: 'fas fa-share-alt',
      description: 'Manage social media links'
    },
    {
      title: 'Analytics',
      path: '/dashboard/analytics',
      icon: 'fas fa-chart-line',
      description: 'View website analytics and statistics'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-500 mb-6">
        <DynamicText text="Dashboard_" typewriter={true} />
      </h1>

      <div className="mb-8">
        <VisitHistory />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="border border-green-500 p-6 hover:bg-green-500 hover:text-black transition-all group"
          >
            <div className="flex items-center mb-4">
              <i className={`${item.icon} text-2xl group-hover:text-black`}></i>
              <h2 className="text-xl font-semibold ml-4">{item.title}</h2>
            </div>
            <p className="text-green-400 group-hover:text-black">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard; 