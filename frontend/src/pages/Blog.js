import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import DynamicText from '../components/DynamicText';
import HackerBackground from '../components/HackerBackground';
import '../styles/blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/blog');
      console.log('Fetched posts:', response.data);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filter === 'all' || post.category === filter;
    return matchesSearch && matchesCategory;
  });

  const renderFilterBar = () => (
    <div className="border border-green-500 p-4 mb-6 space-y-4">
      <div className="flex flex-wrap gap-3">
        {['all', 'programming', 'technology', 'web-development'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 border ${
              filter === cat 
                ? 'bg-green-500 text-black' 
                : 'border-green-500 hover:bg-green-500 hover:text-black'
            } transition-colors text-sm uppercase`}
          >
            {cat.replace('-', ' ')}
          </button>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black border border-green-500 p-2 text-green-500 focus:border-green-400 focus:outline-none pl-10"
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500"></i>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black">
      <HackerBackground type="matrix" />
      <div className="relative z-10">
        <div className="min-h-screen bg-black text-green-500 font-mono p-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="border border-green-500 p-4 mb-6">
              <h1 className="text-2xl font-bold mb-2">
                <DynamicText text="HACKER'S LOG" typewriter={true} />
              </h1>
              <p className="text-sm text-green-400">
                [ENTRIES: {filteredPosts.length}/{posts.length}]
                <br />
                [STATUS: {loading ? 'LOADING...' : 'READY'}]
              </p>
            </div>

            {/* Filter Bar */}
            {renderFilterBar()}

            {/* Blog Posts */}
            {loading ? (
              <div className="text-center py-8">
                <p className="text-green-500 animate-pulse">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-green-500">No posts found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post.slug || post._id}`}
                    className="blog-post cursor-pointer transform hover:scale-102 transition-transform border border-green-500 p-6 hover:border-green-400"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs border border-green-500 px-2 py-1">
                        LOG_{post._id.substring(0, 6)}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-4">
                      <DynamicText text={post.title} glitch={true} />
                    </h2>

                    {post.image && (
                      <div className="relative h-48 mb-4 overflow-hidden border border-green-500">
                        <img
                          src={post.image.url}
                          alt={post.image.alt || post.title}
                          className="w-full h-full object-cover filter grayscale hover:filter-none transition-all"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="text-green-400 mb-4">
                      {post.description || post.content.substring(0, 150) + '...'}
                    </div>

                    {/* Post metadata */}
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm">
                          <i className="fas fa-eye mr-1"></i>
                          {post.views || 0}
                        </span>
                        {post.readTime && (
                          <span className="text-sm">
                            <i className="fas fa-clock mr-1"></i>
                            {post.readTime} min read
                          </span>
                        )}
                      </div>
                      <span className="text-green-500 hover:text-green-400">
                        READ_MORE &gt;
                      </span>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs border border-green-500 px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog; 