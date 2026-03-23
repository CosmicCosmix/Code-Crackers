import { useState } from 'react';
import './Toolbar.css';

export default function Toolbar({ 
  activeTool, setActiveTool, 
  brushSize, setBrushSize, 
  onUndo, canUndo,
  wallColor, setWallColor,
  onClearMask
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const PRESET_COLORS = [
    '#ffffff', '#f5f5dc', '#e6e6fa', '#ffb6c1',
    '#add8e6', '#90ee90', '#ffffe0', '#dda0dd',
    '#f08080', '#20b2aa', '#778899', '#f4a460'
  ];

  const handleColorSelect = (color) => {
    setWallColor(color);
    setShowColorPicker(false);
    // TODO: Trigger img2img API call here
  };

  return (
    <div className="toolbar hairline-r">
      <div className="tool-group">
        <button 
          className={`tool-btn ${activeTool === 'brush' ? 'active' : ''}`}
          onClick={() => setActiveTool('brush')}
          title="Mask Brush"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 22 3-10"/><path d="m11 12 5-6c1-1 3-1 4 0s1 3 0 4l-6 5"/><circle cx="12" cy="18" r="2"/></svg>
        </button>
        {activeTool === 'brush' && (
          <div className="tool-popover slider-popover">
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))} 
              className="brush-slider"
            />
          </div>
        )}

        <button 
          className="tool-btn" 
          onClick={onClearMask}
          title="Clear Mask"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div className="tool-group">
        <button 
          className={`tool-btn ${activeTool === 'roam' ? 'active' : ''}`}
          onClick={() => setActiveTool('roam')}
          title="Roam (Pan/Zoom)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
        </button>
      </div>

      <div className="tool-group relative">
        <button 
          className={`tool-btn ${showColorPicker ? 'active' : ''}`}
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Wall Colour"
        >
          <div className="color-indicator" style={{ backgroundColor: wallColor || 'transparent' }}>
            {!wallColor && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          </div>
        </button>
        {showColorPicker && (
          <div className="tool-popover color-popover">
            <div className="color-grid">
              {PRESET_COLORS.map(c => (
                <div 
                  key={c} 
                  className="color-swatch" 
                  style={{backgroundColor: c}}
                  onClick={() => handleColorSelect(c)}
                />
              ))}
            </div>
            <div className="hex-input-wrapper hairline-t pt-12 mt-12">
              <input 
                type="text" 
                className="hex-input" 
                placeholder="#Hex" 
                defaultValue={wallColor || ''}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleColorSelect(e.currentTarget.value)
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="spacer flex-grow" />

      <div className="tool-group mb-16">
        <button 
          className="tool-btn" 
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
      </div>
    </div>
  );
}
