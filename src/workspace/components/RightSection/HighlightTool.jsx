import { useState, useMemo } from 'react';
import './HighlightTool.css';

export default function HighlightTool({ highlights, onUpdate, isExpanded, onToggleExpand }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [activeFilters, setActiveFilters] = useState(['Sure Exam Question', 'Important', 'Less Important']);

  const categories = [
    { name: 'Sure Exam Question', color: '#FACC15', icon: '⭐' },
    { name: 'Important', color: '#90EE90', icon: '📌' },
    { name: 'Less Important', color: '#ADD8E6', icon: '💡' }
  ];

  // Toggle filter
  const toggleFilter = (category) => {
    setActiveFilters(prev => 
      prev.includes(category)
        ? prev.filter(f => f !== category)
        : [...prev, category]
    );
  };

  // Show only exam-critical
  const showOnlyExam = () => {
    setActiveFilters(['Sure Exam Question']);
  };

  // Show all
  const showAll = () => {
    setActiveFilters(['Sure Exam Question', 'Important', 'Less Important']);
  };

  // Get stats
  const stats = useMemo(() => {
    const counts = {};
    categories.forEach(cat => {
      counts[cat.name] = highlights.filter(h => h.category === cat.name).length;
    });
    return counts;
  }, [highlights]);

  // Filter highlights
  const filteredHighlights = highlights.filter(h => activeFilters.includes(h.category));

  const handleEdit = (index, field, value) => {
    const updated = [...highlights];
    const realIndex = highlights.indexOf(filteredHighlights[index]);
    updated[realIndex][field] = value;
    
    // Update color if category changes
    if (field === 'category') {
      const cat = categories.find(c => c.name === value);
      updated[realIndex].color = cat.color;
    }
    
    onUpdate(updated);
  };

  const handleDelete = (index) => {
    const realIndex = highlights.indexOf(filteredHighlights[index]);
    const updated = highlights.filter((_, i) => i !== realIndex);
    onUpdate(updated);
    setEditingIndex(null);
  };

  const handleExport = () => {
    let text = '# Study Highlights\n\n';
    
    categories.forEach(cat => {
      const items = highlights.filter(h => h.category === cat.name);
      if (items.length > 0) {
        text += `## ${cat.icon} ${cat.name} (${items.length})\n\n`;
        items.forEach((item, i) => {
          text += `${i + 1}. ${item.text}\n\n`;
        });
      }
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-highlights.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`highlight-tool ${isExpanded ? 'expanded' : ''}`}>
      <div className="tool-header">
        <h3>Study Highlights ({highlights.length})</h3>
        <div className="tool-actions">
          <button onClick={handleExport} className="export-btn" title="Export highlights">
            Export
          </button>
          <button onClick={onToggleExpand} className="expand-btn" title={isExpanded ? "Minimize" : "Expand"}>
            {isExpanded ? '↙' : '↗'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="highlight-stats">
        {categories.map(cat => (
          <div 
            key={cat.name}
            className={`stat-item ${activeFilters.includes(cat.name) ? 'active' : 'inactive'}`}
            style={{ borderColor: cat.color }}
            onClick={() => toggleFilter(cat.name)}
          >
            <span className="stat-icon">{cat.icon}</span>
            <span className="stat-label">{cat.name}</span>
            <span className="stat-count">{stats[cat.name]}</span>
          </div>
        ))}
      </div>

      {/* Filter buttons */}
      <div className="filter-controls">
        <button onClick={showOnlyExam} className="filter-btn exam">
          ⭐ Exam Critical Only
        </button>
        <button onClick={showAll} className="filter-btn all">
          📚 Show All
        </button>
      </div>

      {/* Highlights list */}
      <div className="highlights-container">
        {filteredHighlights.length === 0 ? (
          <div className="empty-state">
            <p>No highlights in selected categories</p>
            <button onClick={showAll} className="show-all-btn">Show All</button>
          </div>
        ) : (
          <div className="highlights-list">
            {filteredHighlights.map((highlight, index) => (
              <div 
                key={index} 
                className="highlight-card"
                style={{ borderLeftColor: highlight.color }}
              >
                <div className="highlight-header">
                  <span 
                    className="highlight-badge"
                    style={{ backgroundColor: highlight.color }}
                  >
                    {categories.find(c => c.name === highlight.category)?.icon} {highlight.category}
                  </span>
                  <span className="highlight-number">#{index + 1}</span>
                </div>

                {editingIndex === index ? (
                  <div className="highlight-edit">
                    <textarea
                      value={highlight.text}
                      onChange={(e) => handleEdit(index, 'text', e.target.value)}
                      placeholder="Enter highlight text"
                    />
                    <select
                      value={highlight.category}
                      onChange={(e) => handleEdit(index, 'category', e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className="edit-actions">
                      <button onClick={() => setEditingIndex(null)} className="save-btn">
                        Save
                      </button>
                      <button onClick={() => handleDelete(index)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="highlight-text">{highlight.text}</p>
                    <button 
                      className="edit-trigger-btn"
                      onClick={() => setEditingIndex(index)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}