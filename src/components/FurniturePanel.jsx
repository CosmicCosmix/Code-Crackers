import { useState } from 'react';
import './FurniturePanel.css';

export const FURNITURE_PRESETS = [
  { id: 'wall-1', name: 'Wall Section (2m)', category: 'architecture', size: [2, 2.8, 0.2], color: '#FFFFFF', icon: 'M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18' },
  { id: 'wall-2', name: 'Wall Section (4m)', category: 'architecture', size: [4, 2.8, 0.2], color: '#FFFFFF', icon: 'M3 3h18v18H3z' },
  { id: 'floor-1', name: 'Floor Grid', category: 'architecture', size: [4, 0.1, 4], color: '#EAEAEA', icon: 'M3 10h18v4H3z' },
  { id: 'sofa-1', name: 'Sofa', category: 'seating', size: [2, 0.8, 0.9], color: '#333333', icon: 'M4 10h16v8H4z M6 10V7a2 2 0 012-2h8a2 2 0 012 2v3' },
  { id: 'chair-1', name: 'Armchair', category: 'seating', size: [0.9, 0.9, 0.9], color: '#666666', icon: 'M5 10h14v8H5z M7 10V6a2 2 0 012-2h6a2 2 0 012 2v4' },
  { id: 'table-1', name: 'Coffee Table', category: 'tables', size: [1.2, 0.4, 0.7], color: '#1A1A1A', icon: 'M3 8h18v4H3z M5 12v6 M19 12v6' },
  { id: 'table-2', name: 'Dining Table', category: 'tables', size: [1.8, 0.75, 1.0], color: '#000000', icon: 'M2 6h20v4H2z M4 10v10 M20 10v10' },
  { id: 'bed-1', name: 'Double Bed', category: 'beds', size: [1.6, 0.5, 2.0], color: '#E0E0E0', icon: 'M4 14h16v6H4z M4 14V6h16v8' },
  { id: 'storage-1', name: 'Bookshelf', category: 'storage', size: [1.0, 2.2, 0.4], color: '#4D4D4D', icon: 'M4 4h16v16H4z M4 9h16 M4 14h16 M4 19h16' },
  { id: 'decor-1', name: 'Plant Pot', category: 'decor', size: [0.4, 0.6, 0.4], color: '#111111', icon: 'M8 12h8l-1.5 8h-5L8 12z M12 12V4 M10 6l2-2 2 2' },
  { id: 'decor-2', name: 'Rug (Flat)', category: 'decor', size: [2.5, 0.02, 3.5], color: '#888888', icon: 'M3 6h18v12H3z' }
];

export default function FurniturePanel({ onSelectFurniture }) {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'architecture', 'seating', 'tables', 'beds', 'storage', 'decor'];
  
  const filtered = activeTab === 'All' 
    ? FURNITURE_PRESETS 
    : FURNITURE_PRESETS.filter(item => item.category === activeTab);

  return (
    <aside className="furniture-panel hairline-l">
      <div className="panel-header hairline-b">
        <h3>3D Blocks</h3>
      </div>
      
      <div className="panel-tabs">
        {tabs.map(tab => (
          <button 
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="catalog-list">
        {filtered.map(item => (
          <div key={item.id} className="catalog-row" onClick={() => onSelectFurniture(item)}>
            <div className="row-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d={item.icon || 'M4 4h16v16H4z'}/>
              </svg>
            </div>
            <div className="row-name">{item.name}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
