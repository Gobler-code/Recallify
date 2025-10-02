import { useState } from 'react';
import './QuizTool.css';

export default function QuizTool({ quizzes, onUpdate, isExpanded, onToggleExpand }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleEdit = (index, field, value) => {
    const updated = [...quizzes];
    updated[index][field] = value;
    onUpdate(updated);
  };

  const handleOptionEdit = (qIndex, optIndex, value) => {
    const updated = [...quizzes];
    updated[qIndex].options[optIndex] = value;
    onUpdate(updated);
  };

  const handleDelete = (index) => {
    const updated = quizzes.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const handleAnswer = (index, answer) => {
    setUserAnswers(prev => ({ ...prev, [index]: answer }));
  };

  const calculateScore = () => {
    let correct = 0;
    quizzes.forEach((quiz, index) => {
      if (userAnswers[index] === quiz.answer) {
        correct++;
      }
    });
    return { correct, total: quizzes.length };
  };

  const handleExport = () => {
    const text = quizzes
      .map((q, i) => {
        const opts = q.options.map((opt, idx) => `   ${String.fromCharCode(65 + idx)}. ${opt}`).join('\n');
        return `${i + 1}. ${q.question}\n${opts}\n   Answer: ${q.answer}`;
      })
      .join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const score = showResults ? calculateScore() : null;

  return (
    <div className={`quiz-tool ${isExpanded ? 'expanded' : ''}`}>
      <div className="tool-header">
        <h3>Quiz ({quizzes.length} questions)</h3>
        <div className="tool-actions">
          {!showResults && (
            <button onClick={() => setShowResults(true)} className="check-btn">
              Check Answers
            </button>
          )}
          {showResults && (
            <button onClick={() => { setShowResults(false); setUserAnswers({}); }} className="retry-btn">
              Try Again
            </button>
          )}
          <button onClick={handleExport} className="export-btn">
            Export
          </button>
          <button onClick={onToggleExpand} className="expand-btn">
            {isExpanded ? '↙' : '↗'}
          </button>
        </div>
      </div>

      {showResults && score && (
        <div className="quiz-score">
          Score: {score.correct} / {score.total} ({Math.round((score.correct / score.total) * 100)}%)
        </div>
      )}

      <div className="quiz-list">
        {quizzes.map((quiz, qIndex) => (
          <div key={qIndex} className={`quiz-question ${
            showResults ? (userAnswers[qIndex] === quiz.answer ? 'correct' : 'incorrect') : ''
          }`}>
            <div className="question-number">Question {qIndex + 1}</div>

            {editingIndex === qIndex ? (
              <div className="quiz-edit">
                <label>Question:</label>
                <textarea
                  value={quiz.question}
                  onChange={(e) => handleEdit(qIndex, 'question', e.target.value)}
                />
                <label>Options:</label>
                {quiz.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionEdit(qIndex, optIndex, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                  />
                ))}
                <label>Correct Answer:</label>
                <select
                  value={quiz.answer}
                  onChange={(e) => handleEdit(qIndex, 'answer', e.target.value)}
                >
                  {quiz.options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
                <button onClick={() => setEditingIndex(null)} className="save-btn">
                  Save
                </button>
              </div>
            ) : (
              <div className="quiz-view">
                <p className="question-text">{quiz.question}</p>
                <div className="quiz-options">
                  {quiz.options.map((option, optIndex) => (
                    <label key={optIndex} className="quiz-option">
                      <input
                        type="radio"
                        name={`quiz-${qIndex}`}
                        value={option}
                        checked={userAnswers[qIndex] === option}
                        onChange={() => handleAnswer(qIndex, option)}
                        disabled={showResults}
                      />
                      <span>{String.fromCharCode(65 + optIndex)}. {option}</span>
                      {showResults && option === quiz.answer && (
                        <span className="correct-indicator">✓</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="quiz-actions">
              <button onClick={() => setEditingIndex(qIndex)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(qIndex)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}