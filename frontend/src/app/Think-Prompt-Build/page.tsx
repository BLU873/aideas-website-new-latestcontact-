'use client';

import React, { useState } from 'react';

// --- Data: In a real app, this would come from an API or a separate file ---
const problemStatements = [ {
    "team_id": "L4M5N",
    "ps_id": "SUS02",
    "title": " Smart To-Do List with Analytics",
    "description": "Build an advanced task management system that tracks productivity patterns, provides insights on completion rates, and offers intelligent task prioritization based on deadlines and importance",
    "category": "Sustainability"
  },
  {
  "team_id": "R6S9T",
  "ps_id": "ACC01",
  "title": "Image-to-Speech Assistant",
  "description": "Build a web app where users can upload an image containing text (e.g., a signboard, page, or notice). The system extracts the text using OCR and then reads it aloud using text-to-speech. Requirement to be fulfilled: image upload + text extraction + speech output.",
  "category": "Accessibility"
 },
 {
    "team_id": "U2V3W",
    "ps_id": "EDU03",
    "title": "Resume Skill Extractor",
    "description": "Build a tool that analyzes a job description and a user's resume, then highlights the key skills that are present or missing from the resume.",
    "category": "Education"
  },
  {
    "team_id": "X7Y1Z",
    "ps_id": "PROD03",
    "title": "Git Commit Message Generator",
    "description": "Create an AI tool that analyzes the changes in a code file and suggests a properly formatted and descriptive git commit message.",
    "category": "Productivity"
  },
  {
    "team_id": "B4C8D",
    "ps_id": "HEALTH03",
    "title": "Workout Plan Generator",
    "description": "Develop an web app that creates a simple, 1-week workout plan based on a user's fitness level, available equipment (e.g., none, dumbbells), and goals.",
    "category": "Health & Wellness"
  },
   {
    "team_id": "Z1A2B",
    "ps_id": "HEALTH07",
    "title": "Healthy Recipe Recommender",
    "description": "Build a tool where users can input ingredients they have at home, and the AI suggests simple, healthy recipes that can be prepared with them.",
    "category": "Health & Wellness"
  },
  {
    "team_id": "H2J6K",
    "ps_id": "SUS03",
    "title": "Energy Consumption Estimator",
    "description": "Create an web app where users can list their home appliances, and an AI estimates their monthly electricity bill and suggests ways to reduce it.",
    "category": "Sustainability"
  },
  {
    "team_id": "L3M7N",
    "ps_id": "CREATIVE03",
    "title": "Personalized Playlist Creator",
    "description": "Build a tool that generates a 10-song playlist based on a user's current mood, a favorite artist, or a specific activity (e.g., 'studying', 'running').",
    "category": "Creative & Fun"
  },
  {
    "team_id": "O1P4Q",
    "ps_id": "EDU04",
    "title": "Argument Analyzer",
    "description": "Create a tool that analyzes a piece of text (like a news article) and identifies the main arguments, claims, and supporting evidence.",
    "category": "Education"
  },
  {
    "team_id": "R8S5T",
    "ps_id": "PROD04",
    "title": "Automated 'To-Do' List",
    "description": "Build an web app that reads a block of text (like an email or meeting notes) and automatically extracts action items to create a to-do list.",
    "category": "Productivity"
  },
  {
    "team_id": "U9V2W",
    "ps_id": "HEALTH04",
    "title": "Sentiment Journal",
    "description": "Develop a simple journaling web app that analyzes the user's daily entry and provides a sentiment score (positive, neutral, negative) to help track mood over time.",
    "category": "Health & Wellness"
  },
  {
    "team_id": "X6Y3Z",
    "ps_id": "LOCAL04",
    "title": "Street Food Recommender",
    "description": "Create a chatbot that recommends famous local street food joints in Pune/PCMC based on user preferences like cuisine type (e.g., 'vada pav', 'misal') and location.",
    "category": "Local Community"
  },
  {
    "team_id": "A7B1C",
    "ps_id": "SUS04",
    "title": "Fast Fashion Alternative Finder",
    "description": "Build a tool that, given a link to a clothing item, uses AI to suggest more sustainable alternatives like local brands or second-hand options.",
    "category": "Sustainability"
  },
  {
    "team_id": "G5H9I",
    "ps_id": "ACC02",
    "title": "Simplified Text Summarizer",
    "description": "Develop a tool that takes complex text and rewrites it in simpler language, designed for individuals with learning disabilities or language barriers.",
    "category": "Accessibility"
  },
  {
    "team_id": "M3N7O",
    "ps_id": "PROD05",
    "title": "Presentation Outline Generator",
    "description": "Create a tool that takes a topic and a desired number of slides, and generates a structured outline for a presentation.",
    "category": "Productivity"
  },
  {
    "team_id": "S8T5U",
    "ps_id": "LOCAL05",
    "title": "Marathi Language Tutor Bot",
    "description": "Build a simple chatbot that teaches users basic Marathi phrases and tests their knowledge with simple quizzes.",
    "category": "Local Community"
  },
  {
    "team_id": "V9W2X",
    "ps_id": "SUS05",
    "title": "Plant Care Assistant",
    "description": "Create an web app that uses a photo to identify a houseplant and provides basic care instructions like watering frequency and sunlight needs.",
    "category": "Sustainability"
  },
  {
    "team_id": "Y6Z3A",
    "ps_id": "CREATIVE05",
    "title": "Poetry Generator",
    "description": "Build a tool that writes a short, four-line poem based on a theme or keyword provided by the user.",
    "category": "Creative & Fun"
  },
  {
    "team_id": "B7C1D",
    "ps_id": "EDU06",
    "title": "Analogy Creator",
    "description": "Develop a tool that helps explain complex technical concepts by generating simple analogies. For example, 'A CPU is like the brain of the computer'.",
    "category": "Education"
  },
  {
    "team_id": "E4F8G",
    "ps_id": "PROD06",
    "title": "Bug Report Formatter",
    "description": "Create an web app where a user describes a software bug in plain language, and the AI formats it into a structured bug report with steps to reproduce.",
    "category": "Productivity"
  },
  {
    "team_id": "H5I9J",
    "ps_id": "HEALTH06",
    "title": "Digital Detox Suggester",
    "description": "Build a tool that suggests simple, offline activities (like 'go for a walk', 'read a book for 15 minutes') to help users reduce their screen time.",
    "category": "Health & Wellness"
  },
  {
    "team_id": "K2L6M",
    "ps_id": "LOCAL06",
    "title": "Lost and Found Pet Alerter",
    "description": "Design a system where a user can report a lost or found pet with a photo and location, and the AI helps generate a shareable social media post.",
    "category": "Local Community"
  },
  {
    "team_id": "N3O7P",
    "ps_id": "SUS06",
    "title": "Carbon Footprint Calculator",
    "description": "Create a simple questionnaire-based tool that asks about daily travel and diet to give a user an estimated carbon footprint score.",
    "category": "Sustainability"
  },
  {
    "team_id": "Q1R4S",
    "ps_id": "CREATIVE06",
    "title": "Excuse Generator",
    "description": "A fun, lighthearted tool that generates creative (but obviously fake) excuses for being late to a meeting or missing a deadline.",
    "category": "Creative & Fun"
  },
  {
    "team_id": "T8U5V",
    "ps_id": "ACC03",
    "title": "Color Descriptor",
    "description": "Build an web pp that uses the phone's camera to identify a color in front of it and describes it using both its name (e.g., 'Royal Blue') and descriptive terms (e.g., 'a deep, dark blue like the ocean').",
    "category": "Accessibility"
  },
  {
    "team_id": "W9X2Y",
    "ps_id": "EDU07",
    "title": "Concept Map Generator",
    "description": "Create a tool that takes a central topic and generates a simple mind map or concept map of related ideas and sub-topics to aid in brainstorming.",
    "category": "Education"
  },
  {
    "team_id": "I7J8K",
    "ps_id": "EDU08",
    "title": "Flashcard Generator",
    "description": "Create an web app where a user pastes study material, and the AI automatically generates question–answer flashcards for revision.",
    "category": "Education"
  },
  {
  "team_id": "CAMP01",
  "ps_id": "CAMPENH01",
  "title": "Campus Enhancement Suggestion Platform",
  "description": "Build a platform where students can submit constructive suggestions to improve campus facilities (library, Wi-Fi, sports, events, etc.). Admins can track and update the status of suggestions. Basic version: submit, view, and track suggestions. Bonus: notifications for updates, analytics dashboard to track popular suggestions, and role-based access for students and admins.",
  "category": "Campus Management"
},
{
  "team_id": "D2E5F",
  "ps_id": "HEALTH08",
  "title": "Sleep Quality Tracker",
  "description": "Develop a web app where users log sleep hours and daily habits. The AI gives personalized tips to improve sleep quality, such as reducing screen time or adjusting bedtime.",
  "category": "Health & Wellness"
},
{
  "team_id": "F7G3H",
  "ps_id": "PROD07",
  "title": "Meeting Minutes Generator",
  "description": "Create a tool that listens to meeting audio (or uploaded recording) and generates concise meeting minutes with action points and key takeaways.",
  "category": "Productivity"
},
{
  "team_id": "J4K8L",
  "ps_id": "SUS07",
  "title": "Smart Water Usage Logger",
  "description": "Build a tool where users enter daily water consumption activities (e.g., shower, washing clothes), and the app estimates total water usage with conservation tips.",
  "category": "Sustainability"
},
{
  "team_id": "M5N2O",
  "ps_id": "EDU09",
  "title": "Interactive Quiz Generator",
  "description": "Build a tool where a user inputs a text or PDF, and the system auto-generates multiple-choice quizzes with instant feedback.",
  "category": "Education"
},
{
  "team_id": "P6Q9R",
  "ps_id": "ACC04",
  "title": "Voice-Driven Note Maker",
  "description": "Develop a simple app where users speak, and the system converts speech into well-formatted notes with summaries.",
  "category": "Accessibility"
},
{
  "team_id": "S3T8U",
  "ps_id": "CREATIVE07",
  "title": "AI Comic Strip Creator",
  "description": "Create a tool where a user gives a short story prompt, and the AI generates a 3-panel comic strip with text bubbles.",
  "category": "Creative & Fun"
},
{
  "team_id": "V1W4X",
  "ps_id": "LOCAL07",
  "title": "Event Finder for Students",
  "description": "Develop a chatbot that lists upcoming student events, workshops, or fests in Pune/PCMC with filters like 'tech', 'sports', or 'cultural'.",
  "category": "Local Community"
},
{
  "team_id": "Y2Z5A",
  "ps_id": "CAMPENH02",
  "title": "Smart Study Room Booking",
  "description": "Create a campus tool where students can check availability and reserve library or study rooms. Bonus: suggest best times based on past booking trends.",
  "category": "Campus Management"
}
];

// --- Sub-components for better structure ---

const Header = () => (
    <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Think🤔Prompt👨‍💻Build📲
        </h1>
        <p className="text-lg text-blue-400">Problem Statement Finder</p>
    </header>
);

const SearchForm = ({ teamId, setTeamId, onFind }) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onFind();
        }
    };
    
    return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 md:p-8 shadow-2xl shadow-purple-500/10">
            <div className="flex flex-col sm:flex-row gap-4">
                <input 
                    type="text" 
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your 5-character Team ID"
                    maxLength="5"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                <button 
                    onClick={onFind}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                >
                    Find My PS
                </button>
            </div>
        </div>
    );
};

const ProblemStatementCard = ({ problem }) => (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 md:p-8 shadow-lg transition-all duration-500 ease-in-out transform animate-fadeIn">
        <h2 className="text-sm font-medium text-purple-400 mb-2 uppercase tracking-wider">{problem.category}</h2>
        <h3 className="text-2xl font-bold text-white mb-4">{problem.title}</h3>
        <p className="text-gray-300 leading-relaxed">{problem.description}</p>
        <br />
        <p className="text-gray-300 leading-relaxed"><b>Bonus Marks for extra features</b></p>
    </div>
);

const ErrorCard = ({ message }) => (
    <div className="text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg animate-fadeIn">
        <p>{message}</p>
    </div>
);

// --- Main App Component ---
export default function App() {
    const [teamId, setTeamId] = useState('');
    const [foundProblem, setFoundProblem] = useState(null);
    const [error, setError] = useState('');

    const handleFindProblem = () => {
        // Clear previous results
        setError('');
        setFoundProblem(null);

        if (teamId.length !== 5) {
            setError('Please enter a valid 5-character Team ID.');
            return;
        }
        
        const problem = problemStatements.find(
            (ps) => ps.team_id.toUpperCase() === teamId.trim().toUpperCase()
        );

        if (problem) {
            setFoundProblem(problem);
        } else {
            setError('Team ID not found. Please check the ID and try again.');
        }
    };

    return (
        <main className="min-h-screen bg-black text-gray-200 flex items-center justify-center p-4 font-sans">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-in-out forwards;
                }
            `}</style>
            <div className="w-full max-w-2xl mx-auto">
                <Header />
                <SearchForm 
                    teamId={teamId} 
                    setTeamId={setTeamId} 
                    onFind={handleFindProblem} 
                />
                <div className="mt-8">
                    {error && <ErrorCard message={error} />}
                    {foundProblem && <ProblemStatementCard problem={foundProblem} />}
                </div>
            </div>
        </main>
    );
}

