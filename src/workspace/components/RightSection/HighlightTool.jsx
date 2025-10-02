import { useState } from 'react';
import './HighlightTool.css';

export default function HighlightTool({ highlights, onUpdate, isExpanded, onToggleExpand }) {
  const [editingIndex, setEditingIndex] = useState(null);

  const colors = [
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Green', value: '#90EE90' },
    { name: 'Pink', value: '#FFB6C1' },
    { name: 'Blue', value: '#ADD8E6' },
    { name: 'Orange', value: '#FFA500' }
  ];

  const handleEdit = (index, field, value) => {
    const updated = [...highlights];
    updated[index][field] = value;
    onUpdate(updated);
  };

  const handleDelete = (index) => {
    const updated = highlights.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const handleColorChange = (index, color) => {
    handleEdit(index, 'color', color);
  };

  const handleExport = () => {
    const text = highlights
      .map((h, i) => `${i + 1}. ${h.text} [${h.color}]`)
      .join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'highlights.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`highlight-tool ${isExpanded ? 'expanded' : ''}`}>
      <div className="tool-header">
        <h3>Highlights ({highlights.length})</h3>
        <div className="tool-actions">
          <button onClick={handleExport} className="export-btn">
            Export
          </button>
          <button onClick={onToggleExpand} className="expand-btn">
            {isExpanded ? '↙' : '↗'}
          </button>
        </div>
      </div>

      <div className="highlight-list">
        {highlights.map((highlight, index) => (
          <div key={index} className="highlight-item">
            <div className="highlight-number">#{index + 1}</div>

            {editingIndex === index ? (
              <div className="highlight-edit">
                <textarea
                  value={highlight.text}
                  onChange={(e) => handleEdit(index, 'text', e.target.value)}
                  placeholder="Enter highlighted text"
                />
                <div className="color-picker">
                  <label>Color:</label>
                  <div className="color-options">
                    {colors.map(color => (
                      <button
                        key={color.value}
                        className={`color-option ${highlight.color === color.value ? 'selected' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => handleColorChange(index, color.value)}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                <button onClick={() => setEditingIndex(null)} className="save-btn">
                  Save
                </button>
              </div>
            ) : (
              <div className="highlight-view">
                <p 
                  className="highlight-text" 
                  style={{ backgroundColor: highlight.color }}
                >
                  {highlight.text}
                </p>
              </div>
            )}

            <div className="highlight-actions">
              <button onClick={() => setEditingIndex(index)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(index)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}