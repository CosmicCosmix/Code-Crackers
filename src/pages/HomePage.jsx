import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import './HomePage.css';

const TEMPLATES = [
  { id: 't1', name: 'Living Room', url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80' },
  { id: 't2', name: 'Bedroom', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80' },
  { id: 't3', name: 'Kitchen', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80' },
  { id: 't4', name: 'Bathroom', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80' },
  { id: 't5', name: 'Home Office', url: 'https://images.unsplash.com/photo-1593642702821-c823b13eb295?w=1200&q=80' },
  { id: 't6', name: 'Dining Room', url: 'https://images.unsplash.com/photo-1617806118233-18e1c0945594?w=1200&q=80' },
  { id: 't7', name: 'Kids Room', url: 'https://images.unsplash.com/photo-1522771730849-f06b99d5dafc?w=1200&q=80' },
  { id: 't8', name: 'Studio Apartment', url: 'https://images.unsplash.com/photo-1502672260266-1c1e52b1f417?w=1200&q=80' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { addProject } = useProjects();

  const handleTemplateClick = async (template) => {
    try {
      // Fetch image from Unsplash and convert to base64
      const response = await fetch(template.url, { mode: 'cors' });
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64data = reader.result;
        const newProject = {
          id: Date.now().toString(),
          name: `My ${template.name}`,
          createdAt: new Date().toISOString(),
          wallColor: null,
          history: [
            {
              timestamp: new Date().toISOString(),
              action: 'Initial load',
              imageDataURL: base64data
            }
          ]
        };
        await addProject(newProject);
        navigate(`/design/${newProject.id}`);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error creating project from template", error);
      alert("Failed to load template image. Please try again.");
    }
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
          {TEMPLATES.map(template => (
            <div key={template.id} className="template-card">
              <div className="template-image-container">
                <img src={template.url} alt={template.name} className="template-image" crossOrigin="anonymous" />
              </div>
              <div className="template-info">
                <span className="template-name">{template.name}</span>
                <button className="btn" onClick={() => handleTemplateClick(template)}>Open →</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
