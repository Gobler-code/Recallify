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

// Generate Highlights - Smart Summary Approach
export async function generateHighlights(text) {
  const wordCount = text.trim().split(/\s+/).length;
  
  // Determine number of highlights based on text length
  let targetCount;
  if (wordCount < 300) {
    targetCount = "5-8";
  } else if (wordCount < 1000) {
    targetCount = "10-20";
  } else {
    targetCount = "20-40";
  }
  
  const prompt = `You are helping build a Smart Highlight Generator feature for a study app. The user has provided text extracted from educational material. Your job is to analyze the content and return a structured list of only the most important points — not the entire text — grouped into three categories of importance.

🎯 GOAL
Summarize the text into clear, study-ready highlight points that represent only the essential ideas or facts. Do not include the whole text or random phrases. Each highlight must be concise, self-contained, and valuable for revision.

📚 CATEGORIES
Each point must belong to one of these three categories:

1. **Sure Exam Question** → Core concepts, definitions, formulas, key facts, or main ideas that are very likely to be asked in exams.
   - Examples: definitions, laws, formulas, core theories, critical dates/events

2. **Important** → Key explanations, examples, processes, or supporting facts that are necessary for understanding.
   - Examples: how something works, why something happens, important examples

3. **Less Important** → Contextual information, historical background, or secondary details that are good to know but not crucial.
   - Examples: interesting facts, background context, supplementary information

🎨 OUTPUT FORMAT
Return a valid JSON array with this structure:
[
  {
    "text": "Concise and clear important point.",
    "category": "Sure Exam Question",
    "color": "#FFD700"
  },
  {
    "text": "Another key point with explanation.",
    "category": "Important",
    "color": "#90EE90"
  }
]

Use these EXACT colors:
- Sure Exam Question → #FFD700 (gold)
- Important → #90EE90 (light green)
- Less Important → #ADD8E6 (light blue)

⚙️ BEHAVIOR RULES
✓ Each highlight should be 1 complete idea, not a random phrase or fragment
✓ Do not include titles, headers, or chapter names as points
✓ Avoid duplication — keep only unique ideas
✓ Target ${targetCount} highlights based on text length
✓ Ensure the tone is clear, direct, and easy to revise
✓ If the text doesn't contain enough unique information, return fewer points rather than inventing fake ones
✓ Focus on what students need to remember for exams and understanding

Text to analyze:
${text}

Return ONLY the JSON array. No markdown code blocks, no explanation, just the raw JSON array.`;

  const response = await callGeminiAPI(prompt);
  const highlights = parseJSONResponse(response);
  
  if (!Array.isArray(highlights)) {
    throw new Error('Invalid highlight format');
  }
  
  // Validate and format highlights
  return highlights
    .filter(h => h.text && h.text.trim().length > 10) // At least 10 characters
    .map((highlight, index) => ({
      id: index,
      text: highlight.text.trim(),
      category: highlight.category || 'Important',
      color: highlight.color || '#90EE90'
    }));
}