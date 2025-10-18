import { useState } from "react";
import './VocabTool.css';
export default function VocabTool({
  vocabInsights,
  onUpdate,
  isExpanded,
  onToggleExpand
}) {
  const handleDelete = (index) => {
    const updated = vocabInsights.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const handleExport = () => {
    const text = vocabInsights
      .map((item, i) => 
        `${i + 1}. Word: ${item.word}\n` +
        `Definition: ${item.definition}\n` +
        `Correct Examples:\n${item.correctExamples.map(ex => `  • ${ex}`).join('\n')}\n` +
        `Incorrect Example: ${item.incorrectExample}`
      )
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = 'vocab-insights.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`vocabInsights-tool ${isExpanded ? 'expanded' : ''}`}>
      <div className="tool-header">
        <h3>Vocabulary Insights ({vocabInsights.length})</h3>
        <div className="tool-actions">
          <button onClick={handleExport} className="export-btn" title="Export vocabularies">
             Export
          </button>
          <button onClick={onToggleExpand} className="expand-btn" title={isExpanded ? "Minimize" : "Expand"}>
            {isExpanded ? '↙' : '↗'}
          </button>
        </div>
      </div>

      <div className="vocabInsight-list">
        {vocabInsights.map((item, index) => (
          <div key={index} className="vocab-card">
            <div className="vocab-header">
              <h4>📚 {item.word}</h4>
              <button 
                onClick={() => handleDelete(index)} 
                className="delete-btn"
                title="Remove this word"
              >
                🗑️Delete
              </button>
            </div>
            
            <div className="vocab-content">
              <div className="definition">
                <strong>Definition:</strong>
                <p>{item.definition}</p>
              </div>

              <div className="correct-examples">
                <strong>✅ Correct Usage:</strong>
                <ul>
                  {item.correctExamples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>

              <div className="incorrect-example">
                <strong>❌ Common Mistake:</strong>
                <p>{item.incorrectExample}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

