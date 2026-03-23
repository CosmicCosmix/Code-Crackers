import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import './UploadPage.css';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [projectName, setProjectName] = useState(`My Room - ${new Date().toLocaleDateString()}`);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { addProject } = useProjects();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovering(false);
    const selected = e.dataTransfer.files[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleCreate = async () => {
    if (!preview) return;
    try {
      const newProject = {
        id: Date.now().toString(),
        name: projectName || 'Untitled Room',
        createdAt: new Date().toISOString(),
        wallColor: null,
        history: [
          {
            timestamp: new Date().toISOString(),
            action: 'Photo upload',
            imageDataURL: preview
          }
        ]
      };
      await addProject(newProject);
      navigate(`/design/${newProject.id}`);
    } catch (e) {
      alert("Failed to create project. Image might be too large for localStorage.");
    }
  };

  return (
    <div className="upload-page flex items-center justify-center p-24">
      <div className="upload-card">
        <h2 className="upload-title">Upload a Room Photo</h2>
        
        {!preview ? (
          <div 
            className={`dropzone ${isHovering ? 'hovering' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{display: 'none'}} 
              onChange={handleFileChange} 
            />
            <div className="dropzone-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:'16px', opacity: 0.5}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              <p>Click to browse or drag and drop</p>
              <p className="subtext">Supports PNG, JPG up to 5MB</p>
            </div>
          </div>
        ) : (
          <div className="preview-container">
            <img src={preview} alt="Room preview" className="preview-image" />
            <button className="btn btn-icon clear-btn" onClick={() => { setFile(null); setPreview(null); }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        )}

        <div className="form-group pt-16">
          <label>Name this project</label>
          <input 
            type="text" 
            className="input-field" 
            value={projectName} 
            onChange={(e) => setProjectName(e.target.value)} 
          />
        </div>

        <button 
          className="btn btn-primary submit-btn w-full mt-24" 
          disabled={!preview}
          onClick={handleCreate}
        >
          Open in Designer →
        </button>
      </div>
    </div>
  );
}
