import { useState } from 'react';
import api from '../utils/axios';
import DynamicText from './DynamicText';

function FaviconManagement() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError('');
    
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError('File size must be less than 1MB');
      return;
    }

    if (!['image/x-icon', 'image/png', 'image/ico'].includes(file.type)) {
      setError('Only .ico and .png files are allowed');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('favicon', selectedFile);

    try {
      const response = await api.post('/api/settings/favicon', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Force favicon refresh in browser
      const links = document.querySelectorAll("link[rel*='icon']");
      links.forEach(link => {
        const newLink = document.createElement('link');
        newLink.rel = link.rel;
        newLink.href = `${response.data.path}`;
        document.head.removeChild(link);
        document.head.appendChild(newLink);
      });

      setMessage({
        type: 'success',
        content: 'Favicon updated successfully! Please refresh to see changes.'
      });
    } catch (error) {
      console.error('Error updating favicon:', error);
      setError(error.response?.data?.message || 'Failed to update favicon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-green-500">
        <DynamicText text="Favicon Management" typewriter={true} />
      </h2>

      <div className="border border-green-500 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              &gt; Current Favicon_
            </label>
            <div className="flex items-center space-x-4">
              <img
                src="/favicon.ico"
                alt="Current Favicon"
                className="w-8 h-8 border border-green-500"
              />
              <span className="text-sm text-green-400">
                Last updated: {new Date(document.querySelector("link[rel*='icon']")?.href.split('?v=')[1] || Date.now()).toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              &gt; Upload New Favicon_
            </label>
            <input
              type="file"
              accept=".ico,.png"
              onChange={handleFileSelect}
              className="block w-full text-sm text-green-500 file:mr-4 file:py-2 file:px-4 file:border file:border-green-500 file:text-green-500 file:bg-transparent hover:file:bg-green-500 hover:file:text-black file:transition-colors"
            />
            <p className="mt-1 text-xs text-green-400">
              Accepted formats: .ico, .png (32x32px recommended)
            </p>
          </div>

          {previewUrl && (
            <div>
              <label className="block text-sm font-medium mb-2">
                &gt; Preview_
              </label>
              <div className="flex items-center space-x-4">
                <img
                  src={previewUrl}
                  alt="New Favicon Preview"
                  className="w-8 h-8 border border-green-500"
                />
                <span className="text-sm text-green-400">
                  {selectedFile?.name}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 border border-red-500 text-red-500">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className={`px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors ${
                (loading || !selectedFile) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Updating...' : 'Update Favicon_'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FaviconManagement; 