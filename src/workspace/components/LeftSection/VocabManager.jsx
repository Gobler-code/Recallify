// VocabManager.jsx
import React, { useState } from 'react';
import "./VocabManager.css";

// We'll rename onClear to onClearVocabList to match your Workspace.jsx prop
export default function VocabManager({
  vocabList, // Array of collected words/phrases
  onRemove,  // Function to remove a single word
  onClearVocabList, // Function to clear the entire list
  onSendToVocabTool // NEW: Function to send the batch to the RightSection
}) {
  const [showModal, setShowModal] = useState(false);

  const MIN_VOCAB_COUNT = 5;
  const MAX_VOCAB_COUNT = 8; // Based on your final confirmed flow, not 10

  // Determine if the "Send to Tool" button should be enabled
  const canSendToTool = vocabList.length >= MIN_VOCAB_COUNT && vocabList.length <= MAX_VOCAB_COUNT;

  const handleSendBatch = () => {
    if (canSendToTool) {
      onSendToVocabTool(vocabList); // Send the actual list
      setShowModal(false); // Close the modal
      onClearVocabList(); // Clear the list after sending
    }
  };

  return (
    <>
      {/* 1) Word Count Badge (Top-Right) */}
      <button
        className={`vocab-badge ${vocabList.length > 0 ? 'active' : ''}`}
        onClick={() => setShowModal(true)}
        aria-label={`View collected vocabulary. ${vocabList.length} items.`}
        title={`Collected Vocabulary: ${vocabList.length} items`}
      >
        <span className="vocab-count">{vocabList.length}</span>
        {/* Optional: Add a small icon here, e.g., a book or a list icon */}
      </button>

      {/* 2) Modal UI Appearance */}
      {showModal && (
        <div className="vocab-modal-overlay">
          <div className="vocab-modal-content">
            <button className="vocab-modal-close" onClick={() => setShowModal(false)} aria-label="Close vocabulary list">
              &times;
            </button>
            <h3>Vocabulary</h3>

            {vocabList.length === 0 ? (
              <p className="empty-vocab-message">No words collected yet. Highlight text to add!</p>
            ) : (
              <ul className="vocab-list">
                {vocabList.map((word, index) => (
                  <li key={index} className="vocab-list-item">
                    <span>{word}</span>
                    <button
                      className="remove-vocab-btn"
                      onClick={() => onRemove(word.toLowerCase())} 
                      aria-label={`Remove ${word}`}
                      title={`Remove "${word}"`}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {vocabList.length > MAX_VOCAB_COUNT && (
              <p className="vocab-error-message">
                Maximum {MAX_VOCAB_COUNT} items allowed. Please delete some.
              </p>
            )}

            {vocabList.length > 0 && ( // Only show clear button if there are items
                <button
                className="clear-all-vocab-btn"
                onClick={() => {
                    
                        onClearVocabList();
                    
                }}
                title="Clear all collected vocabulary"
                aria-label="Clear all collected vocabulary"
              >
                Clear All
              </button>
            )}


            {/* 3) "Send to Tool" Button */}
            <button
              className="send-vocab-to-tool-btn"
              onClick={handleSendBatch}
              disabled={!canSendToTool}
              title={canSendToTool ? "Send collected words for deep dive" : `Collect ${MIN_VOCAB_COUNT} to ${MAX_VOCAB_COUNT} words to send.`}
              aria-label="Send vocabulary batch for processing"
            >
              Send {vocabList.length >= MIN_VOCAB_COUNT ? vocabList.length : ''} Items to Tool
            </button>
            {vocabList.length < MIN_VOCAB_COUNT && (
                <p className="vocab-hint-message">
                    Collect at least {MIN_VOCAB_COUNT} words to enable.
                </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}