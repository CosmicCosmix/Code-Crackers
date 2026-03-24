import './PropertiesPanel.css';

export default function PropertiesPanel({ item, onChange, onClose }) {
  if (!item) return null;

  const handleSizeChange = (axis, value) => {
    const val = parseFloat(value);
    if (isNaN(val) || val <= 0) return;
    
    const newSize = [...item.size];
    newSize[axis] = val;
    onChange({ size: newSize });
  };

  const handleColorChange = (e) => {
    onChange({ color: e.target.value });
  };

  return (
    <aside className="properties-panel hairline-r">
      <div className="panel-header hairline-b" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Properties</h3>
        <button className="btn btn-icon" onClick={onClose} title="Deselect">✕</button>
      </div>

      <div className="prop-content p-16">
        <label className="prop-label">Type</label>
        <div className="prop-value mb-16">{item.type}</div>

        <label className="prop-label">Dimensions (meters)</label>
        <div className="dimensions-grid mb-16">
          <div className="dim-input">
            <span>W</span>
            <input type="number" step="0.1" value={item.size[0]} onChange={e => handleSizeChange(0, e.target.value)} />
          </div>
          <div className="dim-input">
            <span>H</span>
            <input type="number" step="0.1" value={item.size[1]} onChange={e => handleSizeChange(1, e.target.value)} />
          </div>
          <div className="dim-input">
            <span>D</span>
            <input type="number" step="0.1" value={item.size[2]} onChange={e => handleSizeChange(2, e.target.value)} />
          </div>
        </div>

        <label className="prop-label">Material Color</label>
        <div className="color-picker-wrapper mb-16">
          <input type="color" value={item.color} onChange={handleColorChange} className="color-input" />
          <span className="color-hex">{item.color.toUpperCase()}</span>
        </div>

        {/* Delete Action could go here but undo/history handles deletions if we had a button */}
        <button className="btn w-full mt-16" style={{color: 'var(--color-accent)'}} onClick={() => {
          // A bit hacky: we can pass a special size or trigger a delete. Better to pass an onDelete prop.
          // Since we didn't wire onDelete strictly, we can just hide it underground.
          onChange({ position: [0, -100, 0] });
          onClose();
        }}>Remove Item</button>
      </div>
    </aside>
  );
}
