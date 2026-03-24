import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import './UploadPage.css';

export default function UploadPage() {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { addProject } = useProjects();

  const handleCreate = async () => {
    if (!name.trim()) return alert("Please enter a room name.");
    setIsCreating(true);
    const newProject = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      history: [{
        timestamp: new Date().toISOString(),
        action: 'Created Blank Room',
        items: []
      }]
    };
    await addProject(newProject);
    navigate(`/design/${newProject.id}`);
  };

  return (
    <div className="upload-page p-24 fade-in">
      <div className="upload-card shadow-sm border-hairline" style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 32 }}>
        <h2 className="mb-16">Create New 3D Room</h2>
        <p className="mb-24 text-secondary">Start with an empty 3D space to place your furniture blocks.</p>

        <div className="form-group mb-24">
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Project Name</label>
          <input 
            type="text" 
            className="text-input" 
            style={{ width: '100%', padding: '12px 16px', borderRadius: 6, border: '1px solid var(--color-border)' }}
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="e.g. My New Bedroom"
          />
        </div>

        <button 
          className="btn btn-primary lg-btn"
          style={{ width: '100%' }}
          disabled={!name.trim() || isCreating}
          onClick={handleCreate}
        >
          {isCreating ? 'Creating...' : 'Create Room'}
        </button>
      </div>
    </div>
  );
}
