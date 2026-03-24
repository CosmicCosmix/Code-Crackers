import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useState } from 'react';
import './HomePage.css';

const TEMPLATES = [
  { id: 't1', name: 'Standard Room', items: [] },
  { id: 't2', name: 'Living Room Setup', items: [
    { id: 't-sofa', type: 'Sofa', size: [2, 0.8, 0.9], color: '#7a8c9b', position: [0, 0.4, -2], rotation: [0, 0, 0] },
    { id: 't-table', type: 'Coffee Table', size: [1.2, 0.4, 0.7], color: '#8B5A2B', position: [0, 0.2, -0.5], rotation: [0, 0, 0] }
  ]},
  { id: 't3', name: 'Bedroom Setup', items: [
    { id: 't-bed', type: 'Double Bed', size: [1.6, 0.5, 2.0], color: '#c7d9e8', position: [0, 0.25, -2], rotation: [0, 0, 0] }
  ]},
  { id: 't4', name: 'Office Setup', items: [
    { id: 't-desk', type: 'Dining Table', size: [1.8, 0.75, 1.0], color: '#D2B48C', position: [0, 0.375, -2], rotation: [0, 0, 0] },
    { id: 't-chair', type: 'Armchair', size: [0.9, 0.9, 0.9], color: '#d1b89d', position: [0, 0.45, -0.5], rotation: [0, 0, 0] }
  ]}
];

export default function HomePage() {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const [loadingId, setLoadingId] = useState(null);

  const handleUseTemplate = async (template) => {
    setLoadingId(template.id);
    const newProject = {
      id: Date.now().toString(),
      name: template.name,
      createdAt: new Date().toISOString(),
      history: [{
        timestamp: new Date().toISOString(),
        action: 'Initial Template',
        items: template.items
      }]
    };
    await addProject(newProject);
    navigate(`/design/${newProject.id}`);
  };

  return (
    <div className="home-page">
      <div className="top-strip hairline-b">
        <div className="pill-group">
          <button className="btn">Templates</button>
          <button className="btn" onClick={() => navigate('/projects')}>My Rooms</button>
          <button className="btn">Shared</button>
        </div>
        <button className="btn btn-primary upload-btn" onClick={() => navigate('/upload')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          Upload Room
        </button>
        <div className="pill-group">
          <button className="btn">Recent</button>
          <button className="btn">Favourites</button>
        </div>
      </div>

      <header className="hero">
        <h1 className="hero-title">Your personal 3D room designer</h1>
        <p className="hero-subtitle">Upload a photo. Paint a mask. Watch AI furnish your space.</p>
        <button className="btn btn-primary hero-cta" onClick={() => navigate('/upload')}>
          Start from a photo 
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '6px'}}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </header>

      <section className="templates-section">
        <h2>Templates</h2>
        <div className="templates-grid">
          {TEMPLATES.map(tpl => (
            <div 
              key={tpl.id} 
              className="template-card hairline hover-lift"
              onClick={() => handleUseTemplate(tpl)}
            >
              <div className="template-img bg-cover" style={{ backgroundColor: '#e5e2da', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7a8c9b" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <div className="template-info">
                <h4>{tpl.name}</h4>
                {loadingId === tpl.id && <span className="loading-text">Creating 3D Room...</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
