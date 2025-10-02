import { useState } from 'react';
import './FlashcardTool.css';
export default function FlashcardTool({ flashcards, onUpdate, isExpanded, onToggleExpand }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});

  const handleEdit = (index, field, value) => {
    const updated = [...flashcards];
    updated[index][field] = value;
    onUpdate(updated);
  };

  const handleDelete = (index) => {
    const updated = flashcards.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const handleFlip = (index) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleExport = () => {
    const text = flashcards
      .map((card, i) => `${i + 1}. Q: ${card.question}\n   A: ${card.answer}`)
      .join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flashcard-tool ${isExpanded ? 'expanded' : ''}`}>
      <div className="tool-header">
        <h3>Flashcards ({flashcards.length})</h3>
        <div className="tool-actions">
          <button onClick={handleExport} className="export-btn" title="Export flashcards">
            Export
          </button>
          <button onClick={onToggleExpand} className="expand-btn" title={isExpanded ? "Minimize" : "Expand"}>
            {isExpanded ? '↙' : '↗'}
          </button>
        </div>
      </div>

      <div className="flashcard-list">
        {flashcards.map((card, index) => (
          <div key={index} className={`flashcard ${flippedCards[index] ? 'flipped' : ''}`}>
            <div className="flashcard-number">Card {index + 1}</div>
            
            {editingIndex === index ? (
              <div className="flashcard-edit">
                <label>Question:</label>
                <textarea
                  value={card.question}
                  onChange={(e) => handleEdit(index, 'question', e.target.value)}
                  placeholder="Enter question"
                />
                <label>Answer:</label>
                <textarea
                  value={card.answer}
                  onChange={(e) => handleEdit(index, 'answer', e.target.value)}
                  placeholder="Enter answer"
                />
                <button onClick={() => setEditingIndex(null)} className="save-btn">
                  Save
                </button>
              </div>
            ) : (
              <div className="flashcard-view" onClick={() => handleFlip(index)}>
                <div className="flashcard-content">
                  {flippedCards[index] ? (
                    <div className="flashcard-answer">
                      <strong>A:</strong> {card.answer}
                    </div>
                  ) : (
                    <div className="flashcard-question">
                      <strong>Q:</strong> {card.question}
                    </div>
                  )}
                </div>
                <div className="flip-hint">Click to flip</div>
              </div>
            )}

            <div className="flashcard-actions">
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