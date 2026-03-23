import { useState } from 'react';
import './FurniturePanel.css';

const CATALOG = [
  { id: 'f1', category: 'Seating', name: 'Sofa', icon: '🛋️' },
  { id: 'f2', category: 'Seating', name: 'Armchair', icon: '🪑' },
  { id: 'f3', category: 'Tables', name: 'Dining Table', icon: '🍽️' },
  { id: 'f4', category: 'Tables', name: 'Coffee Table', icon: '☕' },
  { id: 'f5', category: 'Seating', name: 'Bed', icon: '🛏️' },
  { id: 'f6', category: 'Storage', name: 'TV Unit', icon: '📺' },
  { id: 'f7', category: 'Storage', name: 'Bookshelf', icon: '📚' },
  { id: 'f8', category: 'Storage', name: 'Wardrobe', icon: '🚪' },
  { id: 'f9', category: 'Tables', name: 'Desk', icon: '💻' },
  { id: 'f10', category: 'Lighting', name: 'Floor Lamp', icon: '💡' },
  { id: 'f11', category: 'Decor', name: 'Plant', icon: '🪴' },
  { id: 'f12', category: 'Tables', name: 'Kitchen Island', icon: '🍳' },
];

const TABS = ['All', 'Seating', 'Tables', 'Storage', 'Lighting', 'Decor'];

export default function FurniturePanel({ onSelectFurniture }) {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All' 
    ? CATALOG 
    : CATALOG.filter(f => f.category === activeTab);

  return (
    <div className="furniture-panel hairline-l">
      <div className="panel-header hairline-b">
        <h3>Furniture Catalog</h3>
        <p className="panel-sub">Select to place via AI</p>
      </div>
      
      <div className="panel-tabs hairline-b">
        {TABS.map(tab => (
          <button 
            key={tab} 
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="panel-content">
        <div className="furniture-grid">
          {filtered.map(item => (
            <div 
              key={item.id} 
              className="furniture-card"
              onClick={() => onSelectFurniture && onSelectFurniture(item)}
              title={`Place ${item.name}`}
            >
              <div className="f-icon">{item.icon}</div>
              <div className="f-name">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
