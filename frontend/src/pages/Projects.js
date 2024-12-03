import { useState, useEffect } from 'react';
import api from '../utils/axios';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/projects');
      if (response.data) {
        const projectsWithTech = response.data.map(project => ({
          ...project,
          technologies: project.technologies || []
        }));
        setProjects(projectsWithTech);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border border-green-500 p-4 mb-6">
          <h1 className="text-2xl font-bold mb-2">
            <span className="animate-pulse">&gt;</span> PROJECT DATABASE
          </h1>
          <p className="text-sm text-green-400">
            [STATUS: {loading ? 'LOADING...' : 'READY'}]
            <br />
            [PROJECTS FOUND: {projects.length}]
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-green-500 animate-pulse">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-green-500">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="border border-green-500 bg-black p-4 hover:border-green-400 transition-all cursor-pointer group"
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Header */}
                <div className="flex justify-between items-center mb-4 border-b border-green-500 pb-2">
                  <span className="text-sm">project_{index + 1}</span>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                </div>

                {/* Project Image */}
                {project.image?.url && (
                  <div className="relative h-48 mb-4 overflow-hidden border border-green-500">
                    <img
                      src={project.image.url}
                      alt={project.title}
                      className="w-full h-full object-cover filter grayscale group-hover:filter-none transition-all"
                    />
                    <div className="absolute inset-0 bg-green-500 opacity-10 group-hover:opacity-0 transition-opacity"></div>
                  </div>
                )}

                {/* Project Info */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-green-400">
                  {project.title}
                </h3>
                <p className="text-sm mb-4 text-green-400 opacity-80">
                  {project.description?.substring(0, 100)}...
                </p>

                {/* Tech Stack */}
                {project.technologies?.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-green-500 mb-1">&gt; TECH_STACK:</div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech._id || tech}
                          className="text-xs border border-green-500 px-2 py-1"
                        >
                          {tech.name || tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex justify-between text-sm">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      &gt; VIEW_CODE
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      &gt; LIVE_DEMO
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
            <div className="bg-black border border-green-500 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedProject.title}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-green-500 hover:text-green-400"
                >
                  [X]
                </button>
              </div>
              
              {selectedProject.image && (
                <img
                  src={selectedProject.image.url}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover mb-4 border border-green-500"
                />
              )}
              
              <pre className="text-sm mb-4 whitespace-pre-wrap">
                {selectedProject.description}
              </pre>

              <div className="mb-4">
                <div className="text-sm mb-2">&gt; Technologies:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <span
                      key={tech._id}
                      className="text-xs border border-green-500 px-2 py-1"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                {selectedProject.githubLink && (
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-400"
                  >
                    &gt; View Source Code
                  </a>
                )}
                {selectedProject.liveLink && (
                  <a
                    href={selectedProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-400"
                  >
                    &gt; Visit Live Site
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects; 