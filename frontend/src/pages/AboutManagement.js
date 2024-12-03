import { useState, useEffect } from 'react';
import api from '../utils/axios';
import DynamicText from '../components/DynamicText';

function AboutManagement() {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    content: '',
    order: 0,
    isVisible: true,
    icon: ''
  });

  const sectionTypes = {
    PERSONAL_PROFILE: {
      label: 'Personal Profile',
      icon: 'fas fa-user',
      description: 'Basic information and introduction'
    },
    TECHNICAL_EXPERTISE: {
      label: 'Technical Expertise',
      icon: 'fas fa-laptop-code',
      description: 'Skills and technical knowledge'
    },
    CAREER_TIMELINE: {
      label: 'Career Timeline',
      icon: 'fas fa-history',
      description: 'Professional experience and achievements'
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      setFormData({
        section: selectedSection.section,
        title: selectedSection.title || '',
        content: selectedSection.content || '',
        order: selectedSection.order || 0,
        isVisible: selectedSection.isVisible ?? true,
        icon: selectedSection.icon || ''
      });
    }
  }, [selectedSection]);

  const fetchSections = async () => {
    try {
      const response = await api.get('/api/about');
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        section: formData.section,
        title: formData.title,
        content: formData.content,
        order: formData.order,
        isVisible: formData.isVisible
      };

      if (selectedSection) {
        await api.put(`/api/about/${selectedSection._id}`, dataToSend);
      } else {
        await api.post('/api/about', dataToSend);
      }
      
      await fetchSections();
      resetForm();
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleToggleVisibility = async (sectionId, currentVisibility) => {
    try {
      await api.patch(`/api/about/${sectionId}/visibility`, {
        isVisible: !currentVisibility
      });
      fetchSections();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await api.delete(`/api/about/${id}`);
        fetchSections();
      } catch (error) {
        console.error('Error deleting section:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedSection(null);
    setFormData({
      section: '',
      title: '',
      content: '',
      order: 0,
      isVisible: true,
      icon: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-green-500">
          <DynamicText text="About Management_" typewriter={true} />
        </h1>
        <button
          onClick={() => setSelectedSection(null)}
          className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>
          New Section_
        </button>
      </div>

      {!selectedSection && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(sectionTypes).map(([key, { label, icon, description }]) => (
            <div
              key={key}
              onClick={() => setFormData({ ...formData, section: key })}
              className={`border ${
                formData.section === key ? 'border-green-400' : 'border-green-500'
              } p-4 cursor-pointer hover:bg-green-500 hover:text-black transition-all group`}
            >
              <div className="flex items-center mb-2">
                <i className={`${icon} text-xl group-hover:text-black`}></i>
                <span className="ml-2 font-semibold">{label}</span>
              </div>
              <p className="text-sm text-green-400 group-hover:text-black">
                {description}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="border border-green-500 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">
              <i className="fas fa-layer-group mr-2"></i>
              &gt; Section Type_
            </label>
            <select
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
              required
            >
              <option value="">Select a section</option>
              {Object.entries(sectionTypes).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              <i className="fas fa-heading mr-2"></i>
              &gt; Title_
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            <i className="fas fa-edit mr-2"></i>
            &gt; Content_
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
            rows="10"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">
              <i className="fas fa-sort-numeric-down mr-2"></i>
              &gt; Order_
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
              min="0"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                className="text-green-500 border-green-500 bg-black focus:ring-0"
              />
              <span className="text-sm font-medium">
                <i className={`fas fa-${formData.isVisible ? 'eye' : 'eye-slash'} mr-2`}></i>
                &gt; Visible_
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-green-500">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
          >
            <i className="fas fa-times mr-2"></i>
            Cancel_
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
          >
            <i className={`fas fa-${selectedSection ? 'save' : 'plus'} mr-2`}></i>
            {selectedSection ? 'Update_' : 'Create_'}
          </button>
        </div>
      </form>

      <div className="border border-green-500">
        <table className="min-w-full divide-y divide-green-500">
          <thead>
            <tr className="bg-green-500 text-black">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Section</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-500">
            {sections.map((section) => (
              <tr key={section._id} className="hover:bg-green-500/5">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <i className={`${sectionTypes[section.section].icon} mr-2`}></i>
                    {sectionTypes[section.section].label}
                  </div>
                </td>
                <td className="px-6 py-4">{section.title}</td>
                <td className="px-6 py-4">{section.order}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleVisibility(section._id, section.isVisible)}
                    className={`px-2 py-1 text-xs rounded-full flex items-center ${
                      section.isVisible 
                        ? 'bg-green-500 bg-opacity-20 text-green-400' 
                        : 'bg-red-500 bg-opacity-20 text-red-400'
                    }`}
                  >
                    <i className={`fas fa-${section.isVisible ? 'eye' : 'eye-slash'} mr-1`}></i>
                    {section.isVisible ? 'Visible' : 'Hidden'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedSection(section)}
                    className="text-green-500 hover:text-green-300 mr-4"
                  >
                    <i className="fas fa-edit mr-1"></i>
                    Edit_
                  </button>
                  <button
                    onClick={() => handleDelete(section._id)}
                    className="text-red-500 hover:text-red-300"
                  >
                    <i className="fas fa-trash-alt mr-1"></i>
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

export default AboutManagement; 