import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/axios';
import DynamicText from './DynamicText';
import HackerBackground from './HackerBackground';
import BlogEditor from './Editor';

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [content, setContent] = useState(post?.content || '');
  const [saving, setSaving] = useState(false);

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationPermission(true);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission === 'granted');
        });
      }
    }
  }, []);

  // Fetch social links
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await api.get('/api/social');
        setSocialLinks(response.data.filter(link => link.isActive));
      } catch (error) {
        console.error('Error fetching social links:', error);
      }
    };
    fetchSocialLinks();
  }, []);

  // Fetch post and update views
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('Invalid post URL');
        setLoading(false);
        return;
      }

      try {
        // Fetch post
        const response = await api.get(`/api/blog/post/${slug}`);
        
        if (response.data) {
          const postData = response.data;
          
          // Update views immediately
          try {
            const viewResponse = await api.patch(`/api/blog/${postData._id}/views`);
            
            // Set post with updated view count
            setPost({
              ...postData,
              views: viewResponse.data.views
            });
          } catch (viewError) {
            console.error('Error updating views:', viewError);
            // Still set the post even if view update fails
            setPost(postData);
          }
        } else {
          setError('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Post not found');
        setTimeout(() => navigate('/blog'), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      
      if (notificationPermission) {
        new Notification('Link Copied! 📋', {
          body: 'The blog post link has been copied to your clipboard.',
          icon: '/logo192.png'
        });
      } else {
        // Fallback alert with retro style
        alert(`
======================
   LINK COPIED! 📋
======================
The blog post link has been copied to your clipboard.
        `);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link');
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    try {
      setSaving(true);
      const response = await api.put(`/api/blog/${post._id}`, {
        ...post,
        content
      });

      if (setPost) {
        setPost(response.data);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl animate-pulse">Loading post...</p>
          <p className="text-sm mt-2">Decrypting data...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-red-500 font-mono flex flex-col items-center justify-center">
        <h1 className="text-4xl mb-4">ERROR: Post not found</h1>
        <p className="text-green-500 mb-8">The requested file has been corrupted or deleted.</p>
        <Link 
          to="/blog" 
          className="px-6 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
        >
          &lt; Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      <HackerBackground type="matrix" />
      
      <Helmet>
        <title>{post.title} | Blog</title>
        <meta name="description" content={post.description || post.content.substring(0, 160)} />
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description || post.content.substring(0, 160)} />
        {post.image && <meta property="og:image" content={post.image.url} />}
      </Helmet>

      <div className="relative z-10 min-h-screen bg-black text-green-500 font-mono p-4">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/blog" 
            className="inline-block mb-6 text-green-500 hover:text-green-400"
          >
            &lt; Back to Blog
          </Link>

          <article className="border border-green-500 p-6">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-4">
                <DynamicText text={post.title} glitch={true} />
              </h1>
              
              <div className="flex items-center justify-between text-sm text-green-400 mb-4">
                <span>By {post.author?.username || 'SYSTEM'}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              {post.image && (
                <div className="relative h-64 mb-6">
                  <img
                    src={post.image.url}
                    alt={post.image.alt || post.title}
                    className="w-full h-full object-cover border border-green-500"
                    loading="lazy"
                  />
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 text-xs border border-green-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="space-y-4">
              <BlogEditor
                value={content}
                onChange={(newContent) => setContent(newContent)}
              />
              
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors ${
                    saving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              {/* Preview section */}
              <div className="mt-8 border-t border-green-500 pt-4">
                <h3 className="text-lg font-semibold mb-4">Preview:</h3>
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>

            <footer className="mt-8 pt-4 border-t border-green-500">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <i className="fas fa-eye mr-2"></i>
                    <span className="animate-pulse">{post.views || 0}</span> views
                  </span>
                  {post.readTime && (
                    <span>
                      <i className="fas fa-clock mr-2"></i>
                      {post.readTime} min read
                    </span>
                  )}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors flex items-center gap-2 group"
                >
                  <i className="fas fa-share-alt group-hover:rotate-45 transition-transform"></i>
                  Share Post
                </button>
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-6 pt-4 border-t border-green-500">
                  <h3 className="text-sm mb-3">&gt; Connect with me:</h3>
                  <div className="flex flex-wrap gap-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link._id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-green-500 hover:text-green-400 transition-colors"
                      >
                        <i className={`${link.icon} mr-2`}></i>
                        <span>{link.label || link.platform}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}

export default BlogPost; 