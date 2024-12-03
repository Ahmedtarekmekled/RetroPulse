import { useState, useEffect } from 'react';
import api from '../utils/axios';

function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    githubLink: '',
    liveLink: '',
    image: null
  });
  const [availableTechnologies, setAvailableTechnologies] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchTechnologies();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setFormData({
        title: selectedProject.title || '',
        description: selectedProject.description || '',
        technologies: selectedProject.technologies?.map(tech => tech._id) || [],
        githubLink: selectedProject.githubLink || '',
        liveLink: selectedProject.liveLink || '',
        image: null
      });
    }
  }, [selectedProject]);

  const fetchTechnologies = async () => {
    try {
      const response = await api.get('/api/technologies');
      setAvailableTechnologies(response.data);
    } catch (error) {
      console.error('Error fetching technologies:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Append basic fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    // Convert technologies array to JSON string
    formDataToSend.append('technologies', JSON.stringify(formData.technologies));
    formDataToSend.append('githubLink', formData.githubLink);
    formDataToSend.append('liveLink', formData.liveLink);
    
    // Append image if exists
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      if (selectedProject) {
        await api.put(`/api/projects/${selectedProject._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/api/projects', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error.response?.data || error.message);
    }
  };

  const resetForm = () => {
    setSelectedProject(null);
    setFormData({
      title: '',
      description: '',
      technologies: [],
      githubLink: '',
      liveLink: '',
      image: null
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/api/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-500">&gt; Project Management_</h1>
      
      <form onSubmit={handleSubmit} className="border border-green-500 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">&gt; Title_</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">&gt; Description_</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
            rows="4"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">&gt; Technologies_</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {availableTechnologies.map((tech) => (
              <label key={tech._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.technologies.includes(tech._id)}
                  onChange={(e) => {
                    const techs = e.target.checked
                      ? [...formData.technologies, tech._id]
                      : formData.technologies.filter(id => id !== tech._id);
                    setFormData({ ...formData, technologies: techs });
                  }}
                  className="text-green-500 border-green-500 bg-black focus:ring-0"
                />
                <span className="text-sm">{tech.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">&gt; GitHub Link_</label>
          <input
            type="url"
            value={formData.githubLink}
            onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">&gt; Live Link_</label>
          <input
            type="url"
            value={formData.liveLink}
            onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">&gt; Image_</label>
          <input
            type="file"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            className="mt-1 block w-full text-green-500"
            accept="image/*"
          />
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
            {selectedProject ? 'Update_' : 'Create_'}
          </button>
        </div>
      </form>

      <div className="border border-green-500">
        <table className="min-w-full divide-y divide-green-500">
          <thead>
            <tr className="bg-green-500 text-black">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Technologies</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-500">
            {projects.map((project) => (
              <tr key={project._id}>
                <td className="px-6 py-4 whitespace-nowrap">{project.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {project.technologies?.map(tech => tech.name || '').join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-green-500 hover:text-green-300 mr-4"
                  >
                    Edit_
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
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

export default ProjectManagement; 