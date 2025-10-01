import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import Tesseract from "tesseract.js";
import mammoth from "mammoth";

// Set worker locally to avoid CORS issues
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Detect file type
const getFileType = (file) => {
  const fileType = file.type;
  const extension = file.name.split(".").pop().toLowerCase();

  if (fileType === "application/pdf") return "pdf";
  if (fileType.startsWith("image/")) return "image";
  if (fileType.startsWith("text/")) return "text";
  if (
    extension === "docx" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "docx";
  if (extension === "doc" || fileType === "application/msword") return "doc";
  return "unknown";
};

export const useFileProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // PDF extraction with better formatting
  const extractPDFText = useCallback(async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

      const pages = await Promise.all(
        Array.from({ length: pdf.numPages }, (_, i) =>
          pdf.getPage(i + 1).then((page) =>
            page.getTextContent().then((content) => {
              let lastY = null;
              let text = '';
              let currentLine = '';
              
              content.items.forEach((item) => {
                const currentY = item.transform[5];
                const str = item.str.trim();
                
                if (!str) return; // Skip empty strings
                
                // New line detected
                if (lastY !== null && Math.abs(currentY - lastY) > 5) {
                  // Check if current line should continue (incomplete sentence)
                  const shouldContinue = currentLine.length > 0 && 
                    !currentLine.match(/[.!?:]\s*$/) && // Doesn't end with punctuation
                    !currentLine.match(/^\s*[A-Z\d]/) && // Not a heading/number
                    str.match(/^[a-z]/) && // Next line starts lowercase
                    currentLine.length < 100; // Not too long (likely not a full line)
                  
                  if (shouldContinue) {
                    // Continue same paragraph - just add space
                    currentLine += ' ' + str;
                  } else {
                    // New paragraph or sentence
                    if (currentLine) {
                      text += currentLine;
                      
                      // Add appropriate line breaks
                      if (Math.abs(currentY - lastY) > 20) {
                        text += '\n\n'; // Paragraph break
                      } else {
                        text += '\n'; // Line break
                      }
                    }
                    currentLine = str;
                  }
                } else {
                  // Same line - add with space
                  currentLine += (currentLine ? ' ' : '') + str;
                }
                
                lastY = currentY;
              });
              
              // Add last line
              if (currentLine) {
                text += currentLine;
              }
              
              return text;
            })
          )
        )
      );

      // Join pages with clear page breaks
      return pages.join("\n\n═══════════════════════\n\n") || "No text found in PDF.";
    } catch (err) {
      console.error("PDF extraction error:", err);
      throw new Error(`PDF processing failed: ${err.message}`);
    }
  }, []);

  // Word extraction
  const extractWordText = useCallback(async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value || "No text found in Word document.";
    } catch (err) {
      console.error("Word extraction error:", err);
      throw new Error(`Word processing failed: ${err.message}`);
    }
  }, []);

  // OCR extraction
  const extractImageText = useCallback(async (file) => {
    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            console.log("OCR progress:", Math.round(m.progress * 100) + "%");
          }
        },
      });
      return result.data.text || "No text detected in image.";
    } catch (err) {
      console.error("OCR error:", err);
      throw new Error(`Image text extraction failed: ${err.message}`);
    }
  }, []);

  // Plain text extraction
  const extractTextFile = useCallback(async (file) => {
    return await file.text();
  }, []);

  // Process single file
  const processFile = useCallback(
    async (file) => {
      const type = getFileType(file);
      switch (type) {
        case "pdf":
          return await extractPDFText(file);
        case "image":
          return await extractImageText(file);
        case "text":
          return await extractTextFile(file);
        case "docx":
        case "doc":
          return await extractWordText(file);
        default:
          throw new Error(`Unsupported file type: ${file.type}`);
      }
    },
    [extractPDFText, extractImageText, extractTextFile, extractWordText]
  );

  // Process multiple files
  const processFiles = useCallback(
    async (files) => {
      setIsProcessing(true);
      setError(null);

      try {
        const fileArray = Array.from(files);
        const results = await Promise.all(
          fileArray.map(async (file) => {
            try {
              const text = await processFile(file);
              return { fileName: file.name, text, success: true };
            } catch (err) {
              console.error(`Error processing ${file.name}:`, err);
              return { fileName: file.name, text: "", success: false, error: err.message };
            }
          })
        );

        const combinedText = results
          .filter((r) => r.success && r.text)
          .map((r) => r.text)
          .join("\n\n");

        return {
          text: combinedText,
          fileName: fileArray[0]?.name || "Uploaded Content",
          failedFiles: results.filter((r) => !r.success),
          success: true,
        };
      } catch (err) {
        setError(err.message);
        return { text: "", fileName: "", failedFiles: [], success: false, error: err.message };
      } finally {
        setIsProcessing(false);
      }
    },
    [processFile]
  );

  return {
    processFiles,
    isProcessing,
    error,
    clearError: () => setError(null),
  };
};