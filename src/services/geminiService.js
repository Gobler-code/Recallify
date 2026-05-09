// ============================================
// DEMO MODE — set to true for demos/interviews
// set to false to use real Groq API
// ============================================
const DEMO_MODE = true;

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroqAPI(prompt) {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) throw new Error('No response from API');
    return text;

  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}

// Parse JSON from Groq response (handles markdown code blocks)
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

// Calculate optimal number of items based on text length
function calculateItemCount(text) {
  const wordCount = text.trim().split(/\s+/).length;
  const flashcardCount = Math.min(30, Math.max(5, Math.floor(wordCount / 100)));
  const quizCount = Math.min(20, Math.max(5, Math.floor(wordCount / 150)));
  const highlightCount = Math.min(15, Math.max(5, Math.floor(wordCount / 80)));
  return { flashcardCount, quizCount, highlightCount };
}

// ============================================
// DEMO DATA
// ============================================
const DEMO_FLASHCARDS = [
  { question: "What is photosynthesis?", answer: "The process by which green plants convert sunlight, water, and carbon dioxide into glucose and oxygen using chlorophyll." },
  { question: "What is the powerhouse of the cell?", answer: "The mitochondria — it generates ATP through cellular respiration, providing energy for all cell activities." },
  { question: "What is Newton's First Law of Motion?", answer: "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force (Law of Inertia)." },
  { question: "What is osmosis?", answer: "The movement of water molecules through a semipermeable membrane from an area of low solute concentration to high solute concentration." },
  { question: "What is the difference between DNA and RNA?", answer: "DNA is double-stranded, contains deoxyribose sugar and thymine. RNA is single-stranded, contains ribose sugar and uracil. DNA stores genetic info; RNA helps make proteins." },
  { question: "What is the water cycle?", answer: "The continuous movement of water through evaporation, condensation, precipitation, and collection — cycling water between the atmosphere and Earth's surface." },
  { question: "What is natural selection?", answer: "The process by which organisms with traits better suited to their environment survive and reproduce more successfully, driving evolution over generations." },
];

const DEMO_QUIZ = [
  {
    question: "Which organelle is responsible for producing energy in the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"],
    answer: "Mitochondria"
  },
  {
    question: "What gas do plants absorb during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    answer: "Carbon Dioxide"
  },
  {
    question: "Which law states that for every action there is an equal and opposite reaction?",
    options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravity"],
    answer: "Newton's Third Law"
  },
  {
    question: "What is the basic unit of life?",
    options: ["Atom", "Molecule", "Cell", "Tissue"],
    answer: "Cell"
  },
  {
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Earth", "Mars", "Mercury"],
    answer: "Mercury"
  },
];

const DEMO_HIGHLIGHTS = [
  { id: 0, text: "Photosynthesis is the process by which plants use sunlight, water, and CO₂ to produce glucose and oxygen — fundamental to all life on Earth.", category: "Sure Exam Question", color: "#FFD700" },
  { id: 1, text: "Mitochondria generate ATP through cellular respiration, making them the primary energy source for eukaryotic cells.", category: "Sure Exam Question", color: "#FFD700" },
  { id: 2, text: "Newton's Three Laws of Motion form the foundation of classical mechanics, describing inertia, force-acceleration relationships, and action-reaction pairs.", category: "Sure Exam Question", color: "#FFD700" },
  { id: 3, text: "Osmosis is a passive transport process — it requires no energy and moves water from low to high solute concentration across a membrane.", category: "Important", color: "#90EE90" },
  { id: 4, text: "DNA carries genetic instructions and is found in the nucleus. RNA carries those instructions out of the nucleus to ribosomes for protein synthesis.", category: "Important", color: "#90EE90" },
  { id: 5, text: "Natural selection acts on phenotypes (observable traits), not genotypes directly — only traits expressed in an organism affect survival and reproduction.", category: "Important", color: "#90EE90" },
  { id: 6, text: "Charles Darwin published 'On the Origin of Species' in 1859, introducing natural selection as the mechanism of evolution.", category: "Less Important", color: "#ADD8E6" },
  { id: 7, text: "The water cycle has been occurring for billions of years and is responsible for distributing fresh water across Earth's surface.", category: "Less Important", color: "#ADD8E6" },
];

const DEMO_VOCAB = [
  {
    word: "photosynthesis",
    definition: "The biochemical process by which green plants and algae convert light energy into chemical energy stored as glucose, using CO₂ and water.",
    correctExamples: [
      "Plants rely on photosynthesis to produce their own food from sunlight.",
      "Chlorophyll is the pigment that makes photosynthesis possible in plant cells.",
      "Without photosynthesis, oxygen levels in Earth's atmosphere would rapidly decline."
    ],
    incorrectExample: "I need to photosynthesis my notes before the exam tonight."
  },
  {
    word: "osmosis",
    definition: "The passive movement of water molecules through a selectively permeable membrane from a region of lower solute concentration to higher solute concentration.",
    correctExamples: [
      "Water enters plant root cells through osmosis, moving from soil into the roots.",
      "Red blood cells shrink in a highly saline solution due to osmosis pulling water out.",
      "Osmosis is a passive process, meaning it requires no cellular energy."
    ],
    incorrectExample: "The student osmosised the information by sleeping on his textbook."
  },
  {
    word: "mitochondria",
    definition: "Membrane-bound organelles found in eukaryotic cells that generate most of the cell's supply of ATP through cellular respiration.",
    correctExamples: [
      "Muscle cells contain a high number of mitochondria to meet their energy demands.",
      "The mitochondria convert glucose and oxygen into ATP during aerobic respiration.",
      "Mitochondria have their own DNA, supporting the endosymbiotic theory of their origin."
    ],
    incorrectExample: "She put the mitochondria in the refrigerator to keep it fresh."
  },
];

// ============================================
// EXPORTED FUNCTIONS
// ============================================

export async function generateFlashcards(text) {
  if (DEMO_MODE) {
    // Simulate slight loading delay so it feels real
    await new Promise(res => setTimeout(res, 1000));
    return DEMO_FLASHCARDS;
  }

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

  const response = await callGroqAPI(prompt);
  const flashcards = parseJSONResponse(response);
  
  if (!Array.isArray(flashcards)) {
    throw new Error('Invalid flashcard format');
  }
  
  return flashcards.map(card => ({
    question: card.question || '',
    answer: card.answer || ''
  }));
}

export async function generateQuiz(text) {
  if (DEMO_MODE) {
    await new Promise(res => setTimeout(res, 1200));
    return DEMO_QUIZ;
  }

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

  const response = await callGroqAPI(prompt);
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

export async function generateVocabInsights(wordsList) {
  if (DEMO_MODE) {
    await new Promise(res => setTimeout(res, 1000));
    return DEMO_VOCAB;
  }

  const hardwords = wordsList.join(', ');
    
  const prompt = `Based on the following terms, provide detailed vocabulary insights for each word.

Terms: ${hardwords}

For EACH term, provide:
1. A clear, concise definition
2. 2-3 example sentences demonstrating CORRECT usage
3. 1 example sentence demonstrating INCORRECT or common misuse

Format your response as a JSON array with this EXACT structure:
[
  {
    "word": "photosynthesis",
    "definition": "The process by which plants convert light energy into chemical energy",
    "correctExamples": [
      "Plants use photosynthesis to create their own food from sunlight.",
      "Chlorophyll plays a crucial role in photosynthesis.",
      "Without photosynthesis, there would be no oxygen in our atmosphere."
    ],
    "incorrectExample": "I'm going to photosynthesis my homework tonight."
  }
]

IMPORTANT: 
- Provide insights for ALL ${wordsList.length} terms
- Use the exact field names: "word", "definition", "correctExamples", "incorrectExample"
- correctExamples must be an array of 2-3 strings
- Make examples realistic and educational

Respond ONLY with the JSON array, no additional text or markdown.`;

  const response = await callGroqAPI(prompt);
  const vocabInsights = parseJSONResponse(response);
  
  if (!Array.isArray(vocabInsights)) {
    throw new Error('Invalid vocabulary format');
  }
  
  return vocabInsights.map(vocab => ({
    word: vocab.word || '',
    definition: vocab.definition || '',
    correctExamples: Array.isArray(vocab.correctExamples) ? vocab.correctExamples : [],
    incorrectExample: vocab.incorrectExample || ''
  }));
}

export async function generateHighlights(text) {
  if (DEMO_MODE) {
    await new Promise(res => setTimeout(res, 1100));
    return DEMO_HIGHLIGHTS;
  }

  const wordCount = text.trim().split(/\s+/).length;
  
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
2. **Important** → Key explanations, examples, processes, or supporting facts that are necessary for understanding.
3. **Less Important** → Contextual information, historical background, or secondary details that are good to know but not crucial.

🎨 OUTPUT FORMAT
Return a valid JSON array with this structure:
[
  {
    "text": "Concise and clear important point.",
    "category": "Sure Exam Question",
    "color": "#FFD700"
  }
]

Use these EXACT colors:
- Sure Exam Question → #FFD700 (gold)
- Important → #90EE90 (light green)
- Less Important → #ADD8E6 (light blue)

Target ${targetCount} highlights. Return ONLY the JSON array.

Text to analyze:
${text}`;

  const response = await callGroqAPI(prompt);
  const highlights = parseJSONResponse(response);
  
  if (!Array.isArray(highlights)) {
    throw new Error('Invalid highlight format');
  }
  
  return highlights
    .filter(h => h.text && h.text.trim().length > 10)
    .map((highlight, index) => ({
      id: index,
      text: highlight.text.trim(),
      category: highlight.category || 'Important',
      color: highlight.color || '#90EE90'
    }));
}