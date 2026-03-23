import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const { projects, deleteProject } = useProjects();
  const navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="projects-empty flex-col items-center justify-center p-24 h-full">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.2, marginBottom: 24}}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
        <h2 style={{fontWeight: 500, marginBottom: 8}}>No projects yet</h2>
        <p style={{color: '#666', marginBottom: 24}}>Upload a room photo or start from a template.</p>
        <button className="btn btn-primary" onClick={() => navigate('/upload')}>
          Upload Room →
        </button>
      </div>
    );
  }

  return (
    <div className="projects-page p-24">
      <h1 className="page-title">My Rooms</h1>
      <div className="projects-grid mt-24">
        {projects.map(project => {
          const latestSnapshot = project.history[project.history.length - 1];
          const editCount = project.history.length - 1;
          const date = new Date(project.createdAt).toLocaleDateString();

          return (
            <div key={project.id} className="project-card" onClick={() => navigate(`/design/${project.id}`)}>
              <div className="project-thumb-container">
                {latestSnapshot ? (
                  <img src={latestSnapshot.imageDataURL} alt={project.name} className="project-thumb" />
                ) : (
                  <div className="project-thumb-placeholder" />
                )}
                {project.wallColor && (
                  <div 
                    className="wall-color-swatch"
                    style={{ backgroundColor: project.wallColor }}
                    title={`Wall relative color changed`}
                  />
                )}
              </div>
              <div className="project-info">
                <div>
                  <h3 className="project-name">{project.name}</h3>
                  <div className="project-meta">
                    <span>{date}</span>
                    <span className="meta-dot">•</span>
                    <span>{editCount} {editCount === 1 ? 'edit' : 'edits'}</span>
                  </div>
                </div>
                <div className="project-actions">
                  <button 
                    className="btn btn-icon delete-btn" 
                    onClick={(e) => handleDelete(e, project.id)}
                    title="Delete project"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
