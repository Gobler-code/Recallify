// Replace with your actual API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';
// Helper function to call Gemini API
async function callGeminiAPI(prompt) {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from API');
    }

    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// Parse JSON from Gemini response (handles markdown code blocks)
function parseJSONResponse(text) {
  let cleanText = text.trim();
  
  // Remove markdown code blocks if present
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/```json\n?/, '').replace(/```\s*$/, '');
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/```\n?/, '').replace(/```\s*$/, '');
  }
  
  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('JSON parse error:', error);
    throw new Error('Failed to parse API response');
  }
}

// Calculate optimal number of items based on text length
function calculateItemCount(text) {
  const wordCount = text.trim().split(/\s+/).length;
  
  // 1 flashcard per ~100 words, minimum 5, maximum 30
  const flashcardCount = Math.min(30, Math.max(5, Math.floor(wordCount / 100)));
  
  // 1 quiz question per ~150 words, minimum 5, maximum 20
  const quizCount = Math.min(20, Math.max(5, Math.floor(wordCount / 150)));
  
  // 1 highlight per ~80 words, minimum 5, maximum 15
  const highlightCount = Math.min(15, Math.max(5, Math.floor(wordCount / 80)));
  
  return { flashcardCount, quizCount, highlightCount };
}

// Generate Flashcards
export async function generateFlashcards(text) {
  const { flashcardCount } = calculateItemCount(text);
  
  const prompt = `Based on the following text, generate exactly ${flashcardCount} flashcards as question-answer pairs. 
The number of flashcards is based on the content length to ensure comprehensive coverage.

Format your response as a JSON array with objects containing "question" and "answer" fields.
Make questions clear and concise, and answers comprehensive but not too long.

Example format:
[
  {"question": "What is...", "answer": "It is..."},
  {"question": "How does...", "answer": "It works by..."}
]

Text to analyze:
${text}

Respond ONLY with the JSON array, no additional text.`;

  const response = await callGeminiAPI(prompt);
  const flashcards = parseJSONResponse(response);
  
  if (!Array.isArray(flashcards)) {
    throw new Error('Invalid flashcard format');
  }
  
  return flashcards.map(card => ({
    question: card.question || '',
    answer: card.answer || ''
  }));
}

// Generate Quiz
export async function generateQuiz(text) {
  const { quizCount } = calculateItemCount(text);
  
  const prompt = `Based on the following text, generate exactly ${quizCount} multiple-choice quiz questions.
The number of questions is based on the content length to ensure proper assessment coverage.

Format your response as a JSON array with objects containing "question", "options" (array of 4 choices), and "answer" (the correct option).

Example format:
[
  {
    "question": "What is the main topic?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A"
  }
]

Text to analyze:
${text}

Respond ONLY with the JSON array, no additional text.`;

  const response = await callGeminiAPI(prompt);
  const quizzes = parseJSONResponse(response);
  
  if (!Array.isArray(quizzes)) {
    throw new Error('Invalid quiz format');
  }
  
  return quizzes.map(quiz => ({
    question: quiz.question || '',
    options: Array.isArray(quiz.options) ? quiz.options : [],
    answer: quiz.answer || quiz.options?.[0] || ''
  }));
}

// Generate Highlights
export async function generateHighlights(text) {
  const { highlightCount } = calculateItemCount(text);
  
  const prompt = `Based on the following text, identify exactly ${highlightCount} key sentences or phrases that should be highlighted.
The number of highlights is based on the content length to capture all important points.

Format your response as a JSON array with objects containing "text" (the sentence/phrase) and "color" (hex color code).

Use these colors:
- Yellow (#FFFF00) for main concepts
- Green (#90EE90) for definitions
- Pink (#FFB6C1) for important facts
- Blue (#ADD8E6) for examples
- Orange (#FFA500) for warnings/critical info

Example format:
[
  {"text": "This is an important sentence.", "color": "#FFFF00"},
  {"text": "Another key point.", "color": "#90EE90"}
]

Text to analyze:
${text}

Respond ONLY with the JSON array, no additional text.`;

  const response = await callGeminiAPI(prompt);
  const highlights = parseJSONResponse(response);
  
  if (!Array.isArray(highlights)) {
    throw new Error('Invalid highlight format');
  }
  
  return highlights.map(highlight => ({
    text: highlight.text || '',
    color: highlight.color || '#FFFF00'
  }));
}