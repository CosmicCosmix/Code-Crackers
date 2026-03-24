import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import FurniturePanel from '../components/FurniturePanel';
import Room3DWorkspace from '../components/Room3DWorkspace';
import PropertiesPanel from '../components/PropertiesPanel';
import './DesignPage.css';

export default function DesignPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject } = useProjects();
  const [project, setProject] = useState(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSaving, setShowSaving] = useState(false);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const proj = projects.find(p => p.id === id);
    if (proj) {
      setProject(proj);
      if (!proj.history || proj.history.length === 0) {
        proj.history = [{ timestamp: new Date().toISOString(), action: 'Init', items: [] }];
      }
      setCurrentIndex(proj.history.length - 1);
    }
  }, [id, projects]);

  if (!project) return <div className="p-24">Loading project...</div>;

  const currentSnapshot = project.history[currentIndex] || { items: [] };
  const activeItem = currentSnapshot.items?.find(it => it.id === activeId);

  const handleNameChange = async (e) => {
    const updated = { ...project, name: e.target.value };
    setProject(updated);
    await updateProject(updated);
  };

  const handleUndo = async () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSave = async () => {
    setShowSaving(true);
    await updateProject(project);
    setTimeout(() => setShowSaving(false), 1000);
  };

  const pushNewSnapshot = async (newItems, action) => {
    const newHistory = project.history.slice(0, currentIndex + 1);
    newHistory.push({
      timestamp: new Date().toISOString(),
      action,
      items: newItems
    });
    
    const updated = { ...project, history: newHistory };
    setProject(updated);
    setCurrentIndex(newHistory.length - 1);
    await updateProject(updated);
  };

  const handleAddFurniture = (preset) => {
    const newBlock = {
      id: `${preset.id}-${Date.now()}`,
      type: preset.name,
      size: preset.size,
      color: preset.color,
      position: [Math.random() * 2 - 1, preset.size[1]/2, Math.random() * 2 - 1], // Place slightly randomized
      rotation: [0, 0, 0]
    };
    pushNewSnapshot([...(currentSnapshot.items || []), newBlock], `Add ${preset.name}`);
  };

  const handleUpdateItem = (itemId, updates) => {
    const newItems = currentSnapshot.items.map(it => 
      it.id === itemId ? { ...it, ...updates } : it
    );
    pushNewSnapshot(newItems, 'Move item');
  };

  return (
    <div className="design-page">
      {/* TOP BAR */}
      <header className="design-topbar hairline-b">
        <input 
          type="text" 
          className="project-name-input" 
          value={project.name} 
          onChange={handleNameChange}
          title="Rename project"
        />
        <div className="history-indicator">
           History ({currentIndex + 1}/{project.history?.length || 1})
        </div>
        <div className="spacer flex-grow" />
        <div className="topbar-actions">
          <button 
            className="btn btn-icon" 
            onClick={handleUndo} 
            disabled={currentIndex === 0}
            title="Undo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
          </button>
          <button className="btn" onClick={handleSave}>
            {showSaving ? 'Saved!' : 'Save'}
          </button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="design-workspace" style={{display: 'flex', flexGrow: 1, backgroundColor: 'var(--color-surface)', overflow: 'hidden', position: 'relative'}}>
        {/* LEFT PANEL (Properties) */}
        <PropertiesPanel 
          item={activeItem} 
          onChange={(updates) => handleUpdateItem(activeId, updates)}
          onClose={() => setActiveId(null)}
        />

        {/* MAIN CANVAS AREA (Center) */}
        <div className="canvas-area" style={{ flexGrow: 1, position: 'relative' }}>
            <Room3DWorkspace 
              items={currentSnapshot.items || []}
              onUpdateItem={handleUpdateItem}
              activeId={activeId}
              setActiveId={setActiveId}
            />
        </div>

        {/* RIGHT PANEL (Furniture Catalog) */}
        <FurniturePanel onSelectFurniture={handleAddFurniture} />
      </div>
    </div>
  );
}
