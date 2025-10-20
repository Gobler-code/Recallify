📚 Recallify
🎯 Project Overview

Recallify is an intelligent web application designed to revolutionize how students study. By leveraging AI and advanced file processing, Recallify transforms uploaded documents (PDFs, Word files, images) into interactive study tools—flashcards, quizzes, highlights, and vocabulary aids—making memorization and recall more effective.
With Recallify, passive reading turns into active learning, helping students retain concepts, practice recall, and expand vocabulary efficiently.

Live Demo: https://recallify-uparjan.vercel.app/

✨ Key Features
📄 Smart Document Processing

Multi-format Support: PDF, Word, images, plain text.

Editable Content: Review and edit extracted text.

VocabManager Integration: Select hard words for personalized vocabulary lists.

🧠 AI-Powered Study Tools
Flashcard Generator

Auto-generates Q&A pairs from notes

Interactive flip cards

Edit, delete, and export flashcards

Quiz Generator

Multiple-choice quizzes

Instant feedback and scoring

Editable questions and answers

Highlight Tool

Extracts key sentences and concepts

Color-coded highlights (concepts, definitions, facts, examples, critical info)

Editable highlights

VocabTool (New!)

Select hard words from documents

AI generates:

Definitions/meanings

2–3 correct sentence examples

1 incorrect sentence example (for learning quizzes)

Interactive and editable word cards

🎨 Modern UI

Dark theme for long study sessions

Responsive and intuitive layout

Smooth animations, expandable tool views

🛠️ Tech Stack

React 18.x & Vite – Frontend framework and dev environment

JavaScript (ES6+) & CSS3 – Modern, modular styling

Google Gemini API – AI-powered content generation

pdf.js, Tesseract.js, Mammoth.js – Document processing

Git & GitHub – Version control

📁 Project Structure (Highlights)
workspace/
├── LeftSection/
│   ├── LeftSection.jsx
│   ├── EditableDocument.jsx
│   ├── VocabManager.jsx
├── RightSection/
│   ├── FlashcardTool.jsx
│   ├── QuizTool.jsx
│   ├── HighlightTool.jsx
│   └── VocabTool.jsx
services/
└── geminiService.js

🗺️ Roadmap

Current Version (v1.1)

✅ PDF, Word, and image text extraction

✅ Flashcards & quiz generation

✅ Highlight extraction with color coding

✅ VocabManager & VocabTool

✅ Export functionality

Future Improvements

Spaced Repetition System for intelligent review

Summary & Mind Map generators

Study analytics & performance tracking

Collaborative features & cloud sync

Mobile app & offline mode

Multi-language support & voice notes

🤝 Contributing

Fork the repository

Create a feature branch

Commit changes

Push branch and open a Pull Request

Follow existing code style and add comments where needed.

👨‍💻 Author

Your Uparjan Gautam

GitHub: @Gobler-code

🙏 Acknowledgments

Google Gemini AI – Content generation

pdf.js, Tesseract.js, Mammoth.js – File processing

All contributors and testers

<div align="center"> **Made with ❤️ for students and learners worldwide** ⭐ Star this repo if you find it helpful! </div>
