// Replace with your actual API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

// Helper to call Gemini API
async function callGeminiAPI(prompt) {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('No response from API');

    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// Parse JSON safely, remove markdown code blocks
function parseJSONResponse(text) {
  let cleanText = text.trim();
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

// Generate Flashcards
export async function generateFlashcards(text) {
  const prompt = `Based on the following text, generate 5-10 flashcards as question-answer pairs.
Format ONLY as a JSON array of objects with "question" and "answer".

Text:
${text}`;

  const response = await callGeminiAPI(prompt);
  const flashcards = parseJSONResponse(response);

  if (!Array.isArray(flashcards)) throw new Error('Invalid flashcard format');

  return flashcards.map(card => ({
    question: card.question || '',
    answer: card.answer || ''
  }));
}

// Generate Quiz
export async function generateQuiz(text) {
  const prompt = `Based on the following text, generate 5-8 multiple-choice quiz questions.
Format ONLY as a JSON array of objects with "question", "options" (array of 4), and "answer".

Text:
${text}`;

  const response = await callGeminiAPI(prompt);
  const quizzes = parseJSONResponse(response);

  if (!Array.isArray(quizzes)) throw new Error('Invalid quiz format');

  return quizzes.map(q => ({
    question: q.question || '',
    options: Array.isArray(q.options) ? q.options : [],
    answer: q.answer || q.options?.[0] || ''
  }));
}

// Generate Highlights
export async function generateHighlights(text) {
  const prompt = `Based on the following text, identify 5-10 key sentences or phrases.
Format ONLY as a JSON array of objects with "text" and "color" (hex).

Colors:
Yellow (#FFFF00) - main concepts
Green (#90EE90) - definitions
Pink (#FFB6C1) - important facts
Blue (#ADD8E6) - examples
Orange (#FFA500) - warnings/critical info

Text:
${text}`;

  const response = await callGeminiAPI(prompt);
  const highlights = parseJSONResponse(response);

  if (!Array.isArray(highlights)) throw new Error('Invalid highlight format');

  return highlights.map(h => ({
    text: h.text || '',
    color: h.color || '#FFFF00'
  }));
}
