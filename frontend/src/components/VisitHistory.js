import { useState, useEffect } from 'react';
import api from '../utils/axios';
import DynamicText from './DynamicText';

function VisitHistory() {
  const [visitStats, setVisitStats] = useState({
    total: 0,
    todayViews: 0,
    posts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitStats();
    // Refresh stats every minute
    const interval = setInterval(fetchVisitStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchVisitStats = async () => {
    try {
      const response = await api.get('/api/blog/stats');
      setVisitStats(response.data);
    } catch (error) {
      console.error('Error fetching visit stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-green-500">
        <DynamicText text="Visit Statistics" typewriter={true} />
      </h2>

      {loading ? (
        <div className="text-center py-4">
          <p className="text-green-500 animate-pulse">Loading stats...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-green-500 p-4">
              <h3 className="text-sm text-green-400 mb-2">Total Visits</h3>
              <p className="text-2xl font-bold">{visitStats.total}</p>
            </div>
            <div className="border border-green-500 p-4">
              <h3 className="text-sm text-green-400 mb-2">Most Visited Post</h3>
              <p className="text-lg font-bold">
                {visitStats.posts[0]?.title || 'No data'}
              </p>
              <p className="text-sm text-green-400">
                {visitStats.posts[0]?.views || 0} views
              </p>
            </div>
            <div className="border border-green-500 p-4">
              <h3 className="text-sm text-green-400 mb-2">Average Views</h3>
              <p className="text-2xl font-bold">
                {Math.round(visitStats.total / visitStats.posts.length) || 0}
              </p>
            </div>
          </div>

          <div className="border border-green-500">
            <table className="min-w-full divide-y divide-green-500">
              <thead className="bg-green-500 text-black">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Post Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Last Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-500">
                {visitStats.posts.map((post) => (
                  <tr key={post._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{post.views}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(post.lastVisited).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default VisitHistory; 