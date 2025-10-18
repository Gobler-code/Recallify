import { useState } from 'react';
import ToolSelector from './ToolSelector';
import FlashcardTool from './FlashcardTool';
import QuizTool from './QuizTool';
import HighlightTool from './HighlightTool';
import { generateFlashcards, generateQuiz, generateHighlights,generateVocabInsights } from "../../../services/geminiService";
import './RightSection.css';

export default function RightSection({ notesText,vocabBatch }) {
  const [activeTool, setActiveTool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tool data states
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [vocabInsights, setvocabInsights] = useState([])

  // Expand/collapse state
  const [isExpanded, setIsExpanded] = useState({
    flashcard: false,
    quiz: false,
    highlight: false,
    vocab: false
  });

  // Handle selecting a tool and calling Gemini API
  const handleSelectTool = async (toolId) => {
     if (toolId === 'vocab') {
      if (!vocabBatch || vocabBatch.length < 5) {
        setError("Please collect 5-8 words first in the vocabulary cart");
        setTimeout(() => setError(null), 3000);
        return;
      }
    } else {
      if (!notesText || !notesText.trim()) {
        setError("Please add content in the left section first");
        setTimeout(() => setError(null), 3000);
        return;
      }
    }

    setActiveTool(toolId);
    setLoading(true);
    setError(null);

    try {
      let result;

      switch (toolId) {
        case 'flashcard':
          result = await generateFlashcards(notesText);
          setFlashcards(result);
          setIsExpanded(prev => ({ ...prev, flashcard: true }));
          break;

        case 'quiz':
          result = await generateQuiz(notesText);
          setQuizzes(result);
          setIsExpanded(prev => ({ ...prev, quiz: true }));
          break;

        case 'highlight':
          result = await generateHighlights(notesText);
          setHighlights(result);
          break;

        case 'vocab':
          result = await generateVocabInsights(vocabBatch);
          setvocabInsights(result);
          setIsExpanded(prev => ({...prev ,vocab:true}))
          break;

        default:
          throw new Error('Unknown tool selected');
      }
    } catch (err) {
      setError(`Failed to generate ${toolId}: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle expand/collapse
  const handleToggleExpand = (tool) => {
    setIsExpanded(prev => ({ ...prev, [tool]: !prev[tool] }));
  };

  // Go back to tool selection
  const handleBackToTools = () => {
    setActiveTool(null);
    setIsExpanded({ flashcard: false, quiz: false, highlight: false ,vocab:false });
  };

  const isContentAvailable = notesText && notesText.trim().length > 0;

  return (
    <div className={`right-section ${isExpanded[activeTool] ? 'expanded' : ''}`}>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Generating {activeTool}...</p>
        </div>
      )}

      {!activeTool && !loading && (
        <ToolSelector 
          onSelectTool={handleSelectTool}
          disabled={!isContentAvailable}
        />
      )}

      {activeTool && !loading && (
        <div className="tool-content">
          <button onClick={handleBackToTools} className="back-btn">
            ← Back to Tools
          </button>

          {activeTool === 'flashcard' && (
            <FlashcardTool
              flashcards={flashcards}
              onUpdate={setFlashcards}
              isExpanded={isExpanded.flashcard}
              onToggleExpand={() => handleToggleExpand('flashcard')}
            />
          )}

          {activeTool === 'quiz' && (
            <QuizTool
              quizzes={quizzes}
              onUpdate={setQuizzes}
              isExpanded={isExpanded.quiz}
              onToggleExpand={() => handleToggleExpand('quiz')}
            />
          )}
          {activeTool === 'highlight' && (
            <HighlightTool
              highlights={highlights}
              onUpdate={setHighlights}
              isExpanded={isExpanded.highlight}
              onToggleExpand={() => handleToggleExpand('highlight')}
              originalText={notesText}
            />
          )}
           {activeTool === 'vocab' && (
            <VocabTool
              vocabInsights={vocabInsights}
              onUpdate={setvocabInsights}
              isExpanded={isExpanded.vocab}
              onToggleExpand={() => handleToggleExpand('vocab')}
            />
          )}
        </div>
      )}
    </div>
  );
}
