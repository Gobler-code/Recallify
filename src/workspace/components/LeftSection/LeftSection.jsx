import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFileProcessor } from './useFileProcessor';
import logo from '../../../assets/ismaran.png';
import EditableDocument from './EditableDocument';
import "./LeftSection.css";

export default function LeftSection({ onSubmit,
                                      vocabList,
                                      onAddToVocab,
                                      onRemoveFromVocab,
                                      onClearVocabList,
                                      onSendVocabBatchToTool
                                     }) {
  const [inputText, setInputText] = useState("");
  const [editableContent, setEditableContent] = useState("");
  const [hasContent, setHasContent] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [showError, setShowError] = useState(null);
  

  const fileInputRef = useRef(null);
  const { processFiles, isProcessing, error } = useFileProcessor();

  // Handle text input change in the search bar
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle editable content ochange
  const handleEditableContentChange = (e) => {
    setEditableContent(e.target.value);
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const result = await processFiles(files);
    
    if (result.success && result.text) {
      setEditableContent(result.text);
      setUploadedFileName(result.fileName);
      setHasContent(true);
      setInputText("");
      
      // Show warning if some files failed
      if (result.failedFiles.length > 0) {
        const failedNames = result.failedFiles.map(f => f.fileName).join(', ');
        setShowError(`Some files couldn't be processed: ${failedNames}`);
        setTimeout(() => setShowError(null), 5000);
      }
    } else {
      setShowError(result.error || 'Failed to process files');
      setTimeout(() => setShowError(null), 5000);
    }
    
    // Reset file input
    e.target.value = '';
  };

  // Handle plus button click (file upload trigger)
  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  // Handle submit/enter from search bar
  const handleSearchSubmit = () => {
    const trimmedText = inputText.trim();
    if (trimmedText) {
      setEditableContent(trimmedText);
      setUploadedFileName("Pasted Content");
      setHasContent(true);
      setInputText("");
    }
  };

  // Handle Enter key in search bar
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  // Clear/Reset content
  const handleClearContent = () => {
    setEditableContent("");
    setHasContent(false);
    setUploadedFileName("");
    setInputText("");
    setShowError(null);
  };

  // Send content to parent (for Right Section processing)
  const handleSendToTools = () => {
    const trimmedContent = editableContent.trim();
    if (trimmedContent) {
      onSubmit(trimmedContent);
    }
  };

  // Validate if content can be submitted
  const canSubmit = inputText.trim().length > 0;
  
 
  return (
    <div className="left-section">
      {/* Logo - Now clickable */}
      <Link to="/" className="workspace-logo-link">
        <img 
          src={logo} 
          alt="Recallify Logo" 
          className={hasContent ? "workspace-logo-compact" : "workspace-logo"} 
        />
      </Link>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.txt,.jpg,.jpeg,.png,.gif,.bmp,.doc,.docx"
        multiple
        style={{ display: 'none' }}
        aria-label="Upload file"
      />
      
      {/* Error notification */}
      {(showError || error) && (
        <div className="error-notification" role="alert">
          {showError || error}
        </div>
      )}
      
      {/* Integrated search/source bar */}
      <div className={`integrated-search-bar ${hasContent ? "compact-mode" : ""}`}>
        <button 
          className="integrated-btn plus-btn"
          onClick={handlePlusClick}
          disabled={isProcessing}
          title="Upload file"
          aria-label="Upload PDF, Word document, or image file"
        >
          +
        </button>
        <input
          type="text"
          placeholder={hasContent ? "Add more content..." : "Enter notes or upload a file"}
          className="integrated-search-input"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          aria-label="Text input for notes"
        />
        <button 
          className="integrated-btn submit-btn"
          onClick={handleSearchSubmit}
          disabled={isProcessing || !canSubmit}
          title="Submit text"
          aria-label="Submit entered text"
        >
          ⬆
        </button>
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="processing-indicator" role="status" aria-live="polite">
          <span>Processing files...</span>
        </div>
      )}

      {/* Editable document area */}
      {hasContent && (
        <EditableDocument
          content={editableContent}
          onChange={handleEditableContentChange}
          fileName={uploadedFileName}
          onGenerateTools={handleSendToTools}
          onClear={handleClearContent}
        //vocab props
       vocabList = {vocabList}
       onAddToVocab ={onAddToVocab}
       onRemoveFromVocab = {onRemoveFromVocab}
       onClearVocabList = {onClearVocabList}
       onSendVocabBatchToTool={onSendVocabBatchToTool}
       />
      )}
      

    </div>
  );
}