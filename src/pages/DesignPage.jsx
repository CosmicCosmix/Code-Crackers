import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import Toolbar from '../components/Toolbar';
import FurniturePanel from '../components/FurniturePanel';
import CanvasWorkspace from '../components/CanvasWorkspace';
import { HfTokenModal, PromptModal } from '../components/Modals';
import { createHfPrediction } from '../utils/huggingface';
import './DesignPage.css';

export default function DesignPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, hfToken, updateToken } = useProjects();
  const [project, setProject] = useState(null);

  // Editor State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTool, setActiveTool] = useState('roam');
  const [brushSize, setBrushSize] = useState(40);
  const [wallColor, setWallColor] = useState(null);
  const [showSaving, setShowSaving] = useState(false);
  const [hasMask, setHasMask] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);

  // AI Workflow State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [defaultPrompt, setDefaultPrompt] = useState('a piece of furniture, photorealistic, interior design, consistent room lighting');

  // Ref to access workspace methods
  const workspaceRef = useRef(null);

  useEffect(() => {
    const proj = projects.find(p => p.id === id);
    if (proj) {
      setProject(proj);
      setCurrentIndex(proj.history.length - 1);
      if (proj.wallColor) setWallColor(proj.wallColor);
    }
  }, [id, projects]);

  if (!project) return <div className="p-24">Loading project...</div>;

  const currentSnapshot = project.history[currentIndex];

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
    // In our architecture, it saves on every action, but we can manually stringify to storage here too.
    await updateProject({ ...project, wallColor });
    setTimeout(() => setShowSaving(false), 1000);
  };

  const handleDownload = () => {
    if (!currentSnapshot?.imageDataURL) return;
    const a = document.createElement('a');
    a.href = currentSnapshot.imageDataURL;
    a.download = `${project.name}.png`;
    a.click();
  };

  const ensureApiKey = () => {
    if (!hfToken) {
      setShowKeyModal(true);
      return false;
    }
    return true;
  };

  const handleApplyAI = () => {
    if (!ensureApiKey()) return;
    setShowPromptModal(true);
  };

  const handleApplyWallColor = async (color) => {
    setWallColor(color);
    if (!ensureApiKey()) return;

    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const b64 = await createHfPrediction(hfToken, "stabilityai/stable-diffusion-2-inpainting", {
        inputs: `same room, walls painted in ${color}, photorealistic, interior design`,
        parameters: {
          image: currentSnapshot.imageDataURL,
          strength: 0.45
        }
      });
      // createHfPrediction already returns dataURL
      pushNewSnapshot(b64, 'Change Wall Color');
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFurniture = async (prompt) => {
    setShowPromptModal(false);
    if (!workspaceRef.current) return;

    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const maskBase64 = workspaceRef.current.getMaskBase64();
      const b64 = await createHfPrediction(hfToken, "kandinsky-community/kandinsky-2-2-decoder-inpaint", {
        inputs: prompt,
        parameters: {
          image: currentSnapshot.imageDataURL,
          mask_image: maskBase64,
          negative_prompt: "blurry, cartoon, distorted, low quality",
        }
      });
      pushNewSnapshot(b64, 'Add Furniture');
      setClearTrigger(prev => prev + 1);
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const pushNewSnapshot = async (b64, action) => {
    // Truncate future history if we were undone
    const newHistory = project.history.slice(0, currentIndex + 1);
    newHistory.push({
      timestamp: new Date().toISOString(),
      action,
      imageDataURL: b64
    });

    const updated = { ...project, history: newHistory, wallColor };
    setProject(updated);
    setCurrentIndex(newHistory.length - 1);
    await updateProject(updated);
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
          History ({currentIndex + 1}/{project.history.length})
        </div>
        <div className="spacer flex-grow" />
        <div className="topbar-actions">
          <button
            className="btn btn-icon"
            onClick={handleUndo}
            disabled={currentIndex === 0}
            title="Undo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
          </button>
          <button className="btn" onClick={handleSave}>
            {showSaving ? 'Saved!' : 'Save'}
          </button>
          <button className="btn btn-primary" onClick={handleDownload}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
            Download
          </button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="design-workspace">
        {/* MAIN CANVAS AREA (Left) */}
        <div className="canvas-area">
          <Toolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            onUndo={handleUndo}
            canUndo={currentIndex > 0}
            wallColor={wallColor}
            setWallColor={handleApplyWallColor}
            onClearMask={() => setClearTrigger(prev => prev + 1)}
          />

          <div className="canvas-container">
            <CanvasWorkspace
              ref={workspaceRef}
              imageUrl={currentSnapshot.imageDataURL}
              activeTool={activeTool}
              brushSize={brushSize}
              clearTrigger={clearTrigger}
              onMaskUpdate={setHasMask}
            />
            {hasMask && !isGenerating && (
              <div className="apply-ai-overlay">
                <button className="btn btn-primary lg-btn shadow-btn" onClick={handleApplyAI}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg>
                  Apply AI Furniture
                </button>
              </div>
            )}
            {errorMsg && (
              <div className="error-banner">
                {errorMsg}
                <button className="btn btn-icon" onClick={() => setErrorMsg(null)}>✕</button>
              </div>
            )}
          </div>
        </div>

        {/* LOADING OVERLAY */}
        {isGenerating && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="spinner"></div>
              <p>AI is designing your room…</p>
            </div>
          </div>
        )}

        {/* RIGHT PANEL (Furniture Catalog) */}
        <FurniturePanel onSelectFurniture={(item) => {
          setActiveTool('brush');
          setDefaultPrompt(`a ${item.name.toLowerCase()}, photorealistic, interior design, consistent room lighting`);
          setTimeout(() => alert(`Paint the area where you'd like the ${item.name} placed. Then click "Apply AI Furniture".`), 50);
        }} />
      </div>

      <HfTokenModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onSave={(k) => { updateToken(k); setShowKeyModal(false); }}
      />

      <PromptModal
        isOpen={showPromptModal}
        onClose={() => setShowPromptModal(false)}
        onSubmit={handleGenerateFurniture}
        defaultPrompt={defaultPrompt}
      />
    </div>
  );
}
