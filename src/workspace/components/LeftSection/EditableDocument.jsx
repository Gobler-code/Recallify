import React, { useRef, useMemo } from 'react';
import VocabManager from './VocabManager';
import Selection from './Selection';
export default function EditableDocument({ 
  content, 
  onChange, 
  fileName, 
  onGenerateTools, 
  onClear ,

  vocabList,
  onAddToVocab,
  onRemoveFromVocab,
  onClearVocabList,
  onSendVocabBatchToTool
}) {
  const textareaRef = useRef(null);

  // Memoized stats to avoid recalculating on every render
  const stats = useMemo(() => {
    const charCount = content.length;
    const wordCount = content.trim() 
      ? content.trim().split(/\s+/).length 
      : 0;
    
    return { charCount, wordCount };
  }, [content]);

  return (
    <div className="document-area">
      <div className="document-header">
        <span className="document-title" title={fileName}>
          {fileName}
        </span>
        <div className="document-actions">
          
          <button 
            className="action-btn send-btn"
            onClick={onGenerateTools}
            disabled={!content.trim()}
            title="Send content to tools for processing"
            aria-label="Generate flashcards and quizzes"
          >
            Generate Tools
          </button>
          <button 
            className="action-btn clear-btn"
            onClick={onClear}
            title="Clear all content"
            aria-label="Clear content"
          >
            Clear
          </button>
          <VocabManager
            vocabList={vocabList}
            onRemove={onRemoveFromVocab}
            onClearVocabList={onClearVocabList} 
             onSendToVocabTool={onSendVocabBatchToTool} />
        </div>
      </div>
      
      <textarea
        ref={textareaRef}
        className="editable-document"
        value={content}
        onChange={onChange}
        placeholder="Your content will appear here. You can edit it directly..."
        aria-label="Editable document content"
      />
       <Selection onAddToVocab={onAddToVocab} />
      
      <div className="document-footer">
        <span className="char-count" aria-label="Character count">
          {stats.charCount.toLocaleString()} characters
        </span>
        <span className="word-count" aria-label="Word count">
          {stats.wordCount.toLocaleString()} words
        </span>
      </div>
    </div>
  );
}