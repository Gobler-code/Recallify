import React, { useState, useEffect, useRef } from "react";

export default function Selection({ onAddToVocab }) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState("");
  const popupRef = useRef(null);

  // Helper: ensures user selects a whole word
  const isWholeWordSelection = (text, selection) => {
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    if (container.nodeType === Node.TEXT_NODE) {
      const parentText = container.textContent;
      const startIndex = range.startOffset;
      const endIndex = range.endOffset;
      const charBefore = startIndex > 0 ? parentText[startIndex - 1] : "";
      const charAfter = endIndex < parentText.length ? parentText[endIndex] : "";
      const isAlpha = (c) => /[a-zA-Z0-9]/.test(c);
      if (isAlpha(charBefore) && isAlpha(text[0])) return false;
      if (isAlpha(charAfter) && isAlpha(text[text.length - 1])) return false;
    }
    return true;
  };

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const rawText = selection.toString();
      const trimmedText = rawText.trim();

      // Ignore short or invalid selections
      if (!trimmedText || trimmedText.length <= 2 || !isWholeWordSelection(rawText, selection)) {
        setShowPopup(false);
        return;
      }

      // Get popup position
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(trimmedText);
      setPopupPosition({ top: rect.bottom  +window.scrollY +5, left: rect.left + window.scrollX });
      setShowPopup(true);
    };

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };

    window.addEventListener("mouseup", handleSelection);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mouseup", handleSelection);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddVocab = () => {
    if (selectedText && onAddToVocab) {
      onAddToVocab(selectedText);
    }
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div
          ref={popupRef}
          style={{
            position: "absolute",
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleAddVocab}
            style={{
              background: "#27313f",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            ➕ Add “{selectedText}”
          </button>
        </div>
      )}
    </>
  );
}
