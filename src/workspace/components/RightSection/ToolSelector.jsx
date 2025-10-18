import './ToolSelector.css';

export default function ToolSelector({ onSelectTool, disabled }) {
  const tools = [
    { 
      id: 'flashcard', 
      name: 'Flashcard Generator', 
      icon: '🗂️',
      description: 'Create Q&A flashcards'
    },
    { 
      id: 'quiz', 
      name: 'Quiz Generator', 
      icon: '❓',
      description: 'Generate multiple-choice quizzes'
    },
    { 
      id: 'highlight', 
      name: 'Highlight Generator', 
      icon: '✨',
      description: 'Extract key points'
    },

    {
      id:'vocab',
      name:'Vocabulary',
      icon:'📚',
      discription:'Provide meanings for unknown word'
    }
  ];

  return (
    <div className="tool-selector">
      <h2>Tools</h2>
      <div className="tool-buttons">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            disabled={disabled}
            className="tool-button"
            aria-label={`Generate ${tool.name}`}
            title={tool.description}
          >
            <span className="tool-icon">{tool.icon}</span>
            <div className="tool-text">
              <span className="tool-name">{tool.name}</span>
              <span className="tool-description">{tool.description}</span>
            </div>
          </button>
        ))}
      </div>
      {disabled && (
        <p className="tool-hint">📝 Upload or enter content in the left section first</p>
      )}
    </div>
  );
}