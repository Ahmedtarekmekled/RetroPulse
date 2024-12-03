import { useState, useEffect } from 'react';
import api from '../utils/axios';
import DynamicText from '../components/DynamicText';

function SocialLinksManagement() {
  const [links, setLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState(null);
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    label: '',
    order: 0,
    isActive: true
  });

  const platforms = {
    github: 'GitHub',
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    twitch: 'Twitch',
    discord: 'Discord',
    email: 'Email',
    website: 'Website',
    other: 'Other'
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    if (selectedLink) {
      setFormData({
        platform: selectedLink.platform,
        url: selectedLink.url,
        label: selectedLink.label || '',
        order: selectedLink.order,
        isActive: selectedLink.isActive
      });
    }
  }, [selectedLink]);

  const fetchLinks = async () => {
    try {
      const response = await api.get('/api/social');
      setLinks(response.data);
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedLink) {
        await api.put(`/api/social/${selectedLink._id}`, formData);
      } else {
        await api.post('/api/social', formData);
      }
      fetchLinks();
      resetForm();
    } catch (error) {
      console.error('Error saving social link:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this social link?')) {
      try {
        await api.delete(`/api/social/${id}`);
        fetchLinks();
      } catch (error) {
        console.error('Error deleting social link:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedLink(null);
    setFormData({
      platform: '',
      url: '',
      label: '',
      order: 0,
      isActive: true
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-500">
        <DynamicText text="Social Links Management_" typewriter={true} />
      </h1>

      <form onSubmit={handleSubmit} className="border border-green-500 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">&gt; Platform_</label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
            required
          >
            <option value="">Select a platform</option>
            {Object.entries(platforms).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">&gt; URL_</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">&gt; Label (Optional)_</label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
            placeholder="Custom label for the link"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">&gt; Order_</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
            min="0"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="text-green-500 border-green-500 bg-black focus:ring-0"
            />
            <span className="text-sm font-medium">&gt; Active_</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
          >
            Cancel_
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
          >
            {selectedLink ? 'Update_' : 'Create_'}
          </button>
        </div>
      </form>

      <div className="border border-green-500">
        <table className="min-w-full divide-y divide-green-500">
          <thead>
            <tr className="bg-green-500 text-black">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-500">
            {links.map((link) => (
              <tr key={link._id}>
                <td className="px-6 py-4">
                  <i className={`${link.icon} mr-2`}></i>
                  {platforms[link.platform]}
                </td>
                <td className="px-6 py-4">
                  {link.label || platforms[link.platform]}
                </td>
                <td className="px-6 py-4">
                  {link.order}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    link.isActive ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'
                  }`}>
                    {link.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedLink(link)}
                    className="text-green-500 hover:text-green-300 mr-4"
                  >
                    Edit_
                  </button>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="text-red-500 hover:text-red-300"
                  >
                    Delete_
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SocialLinksManagement; 