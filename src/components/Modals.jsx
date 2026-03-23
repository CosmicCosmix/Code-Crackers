import { useState } from 'react';
import './Modal.css';

export function ReplicateKeyModal({ isOpen, onClose, onSave }) {
  const [key, setKey] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{marginBottom: 8}}>Replicate API Key Required</h3>
        <p style={{marginBottom: 16, fontSize: '0.9rem', color: '#666'}}>
          Enter your Replicate API key to enable AI features. Get a free key at <a href="https://replicate.com" target="_blank" rel="noreferrer" style={{color: 'var(--color-accent)', textDecoration: 'underline'}}>replicate.com</a>.
        </p>
        <input 
          type="password" 
          value={key} 
          onChange={e => setKey(e.target.value)} 
          className="modal-input"
          placeholder="r8_..."
        />
        <div className="modal-actions mt-16">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(key)}>Save Key</button>
        </div>
      </div>
    </div>
  );
}

export function PromptModal({ isOpen, onClose, onSubmit, defaultPrompt }) {
  const [prompt, setPrompt] = useState(defaultPrompt || '');

  // Update prompt if defaultPrompt changes while modal is open (rare but safe)
  // Instead, just set it on mount or rely on the parent mounting it with a new key.

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{marginBottom: 8}}>Customize AI Prompt</h3>
        <p style={{marginBottom: 16, fontSize: '0.9rem', color: '#666'}}>
          Describe exactly how the furniture should look.
        </p>
        <textarea 
          value={prompt} 
          onChange={e => setPrompt(e.target.value)} 
          className="modal-input modal-textarea"
          rows={3}
        />
        <div className="modal-actions mt-16">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSubmit(prompt)}>Generate</button>
        </div>
      </div>
    </div>
  );
}
