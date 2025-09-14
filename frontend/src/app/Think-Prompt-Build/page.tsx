'use client';

import React, { useState } from 'react';

// --- Data: In a real app, this would come from an API or a separate file ---
const problemStatements = [
  { "team_id": "12345", "ps_id": "EDU01", "title": "AI Quiz Generator", "description": "Create an app that takes a block of text (like a chapter from a textbook) and automatically generates multiple-choice questions and flashcards to help students study.", "category": "Education" },
  { "team_id": "A4B9L", "ps_id": "PROD01", "title": "Meeting Summarizer", "description": "Build a tool that takes an audio recording or text transcript of a meeting and generates a concise summary with key decisions and action items.", "category": "Productivity" },
  { "team_id": "C8D2M", "ps_id": "HEALTH01", "title": "Mindful Moment Bot", "description": "Develop a chatbot that can guide users through a short, 2-minute mindfulness or breathing exercise to help reduce stress.", "category": "Health & Wellness" },
  { "team_id": "E5F6N", "ps_id": "LOCAL01", "title": "Pune Traffic Predictor", "description": "Using historical or real-time data (if available), create a simple AI model that predicts traffic conditions for key routes in Pune/PCMC at different times of the day.", "category": "Local Community" },
  { "team_id": "G1H7O", "ps_id": "SUS01", "title": "Waste Sorter AI", "description": "Build an app that uses a phone's camera to identify an item of trash and tells the user whether it belongs in the wet waste, dry waste, or e-waste bin.", "category": "Sustainability" },
  { "team_id": "I3J4P", "ps_id": "CREATIVE01", "title": "Two-Sentence Story Generator", "description": "Create a tool that generates a random two-sentence horror or comedy story based on a single user-provided keyword.", "category": "Creative & Fun" },
  { "team_id": "Q5R8S", "ps_id": "EDU02", "title": "Code Explainer", "description": "Develop a tool where a user can paste a snippet of code, and an AI explains what it does in simple, plain English.", "category": "Education" },
  { "team_id": "T2U9V", "ps_id": "PROD02", "title": "Smart Email Sorter", "description": "Build a system that analyzes incoming emails and automatically categorizes them into folders like 'Urgent', 'Promotions', 'Personal', and 'Work'.", "category": "Productivity" },
  { "team_id": "W6X1Y", "ps_id": "HEALTH02", "title": "Healthy Recipe Suggester", "description": "Create an app where users can input ingredients they have at home, and the AI suggests a healthy recipe they can make with them.", "category": "Health & Wellness" },
  { "team_id": "Z7K3B", "ps_id": "LOCAL02", "title": "Local Event Finder", "description": "Develop a tool that scrapes local news or event websites and uses AI to create a simple, categorized list of upcoming events in the Pimpri-Chinchwad area.", "category": "Local Community" },
  { "team_id": "L4M5N", "ps_id": "SUS02", "title": "Eco-Friendly Tip Bot", "description": "Create a chatbot that provides users with daily, actionable tips on how to live a more sustainable lifestyle.", "category": "Sustainability" },
  { "team_id": "O8P1Q", "ps_id": "CREATIVE02", "title": "AI Logo Idea Generator", "description": "Build a tool that generates simple logo concepts and color palettes based on a company name and a brief description.", "category": "Creative & Fun" },
  { "team_id": "R6S9T", "ps_id": "ACC01", "title": "Image-to-Text Reader", "description": "Create an application that uses a phone camera to read text from an image and speaks it out loud, designed for visually impaired users.", "category": "Accessibility" },
  { "team_id": "U2V3W", "ps_id": "EDU03", "title": "Resume Skill Extractor", "description": "Build a tool that analyzes a job description and a user's resume, then highlights the key skills that are present or missing from the resume.", "category": "Education" },
  { "team_id": "X7Y1Z", "ps_id": "PROD03", "title": "Git Commit Message Generator", "description": "Create an AI tool that analyzes the changes in a code file and suggests a properly formatted and descriptive git commit message.", "category": "Productivity" },
  { "team_id": "B4C8D", "ps_id": "HEALTH03", "title": "Workout Plan Generator", "description": "Develop an app that creates a simple, 1-week workout plan based on a user's fitness level, available equipment (e.g., none, dumbbells), and goals.", "category": "Health & Wellness" },
  { "team_id": "E5F9G", "ps_id": "LOCAL03", "title": "Pothole Reporter Assistant", "description": "Build a tool that allows a user to take a picture of a pothole, and it uses AI to automatically draft an email to the local municipal corporation with the image and extracted location data.", "category": "Local Community" },
  { "team_id": "H2J6K", "ps_id": "SUS03", "title": "Energy Consumption Estimator", "description": "Create an app where users can list their home appliances, and an AI estimates their monthly electricity bill and suggests ways to reduce it.", "category": "Sustainability" },
  { "team_id": "L3M7N", "ps_id": "CREATIVE03", "title": "Personalized Playlist Creator", "description": "Build a tool that generates a 10-song playlist based on a user's current mood, a favorite artist, or a specific activity (e.g., 'studying', 'running').", "category": "Creative & Fun" },
  { "team_id": "O1P4Q", "ps_id": "EDU04", "title": "Argument Analyzer", "description": "Create a tool that analyzes a piece of text (like a news article) and identifies the main arguments, claims, and supporting evidence.", "category": "Education" },
  { "team_id": "R8S5T", "ps_id": "PROD04", "title": "Automated 'To-Do' List", "description": "Build an app that reads a block of text (like an email or meeting notes) and automatically extracts action items to create a to-do list.", "category": "Productivity" },
  { "team_id": "U9V2W", "ps_id": "HEALTH04", "title": "Sentiment Journal", "description": "Develop a simple journaling app that analyzes the user's daily entry and provides a sentiment score (positive, neutral, negative) to help track mood over time.", "category": "Health & Wellness" },
  { "team_id": "X6Y3Z", "ps_id": "LOCAL04", "title": "Street Food Recommender", "description": "Create a chatbot that recommends famous local street food joints in Pune/PCMC based on user preferences like cuisine type (e.g., 'vada pav', 'misal') and location.", "category": "Local Community" },
  { "team_id": "A7B1C", "ps_id": "SUS04", "title": "Fast Fashion Alternative Finder", "description": "Build a tool that, given a link to a clothing item, uses AI to suggest more sustainable alternatives like local brands or second-hand options.", "category": "Sustainability" },
  { "team_id": "D4E8F", "ps_id": "CREATIVE04", "title": "Meme Caption Generator", "description": "Create an app where a user uploads a popular meme template, and the AI generates a witty and relevant caption for it.", "category": "Creative & Fun" },
  { "team_id": "G5H9I", "ps_id": "ACC02", "title": "Simplified Text Summarizer", "description": "Develop a tool that takes complex text and rewrites it in simpler language, designed for individuals with learning disabilities or language barriers.", "category": "Accessibility" },
  { "team_id": "J2K6L", "ps_id": "EDU05", "title": "Historical Figure Chatbot", "description": "Build a chatbot where users can 'talk' to a historical figure (e.g., Chhatrapati Shivaji Maharaj, Albert Einstein) and ask them questions about their life and achievements.", "category": "Education" },
  { "team_id": "M3N7O", "ps_id": "PROD05", "title": "Presentation Outline Generator", "description": "Create a tool that takes a topic and a desired number of slides, and generates a structured outline for a presentation.", "category": "Productivity" },
  { "team_id": "P1Q4R", "ps_id": "HEALTH05", "title": "Water Intake Reminder", "description": "Develop an intelligent chatbot that reminds users to drink water throughout the day with fun, non-repetitive messages.", "category": "Health & Wellness" },
  { "team_id": "S8T5U", "ps_id": "LOCAL05", "title": "Marathi Language Tutor Bot", "description": "Build a simple chatbot that teaches users basic Marathi phrases and tests their knowledge with simple quizzes.", "category": "Local Community" },
  { "team_id": "V9W2X", "ps_id": "SUS05", "title": "Plant Care Assistant", "description": "Create an app that uses a photo to identify a houseplant and provides basic care instructions like watering frequency and sunlight needs.", "category": "Sustainability" },
  { "team_id": "Y6Z3A", "ps_id": "CREATIVE05", "title": "Poetry Generator", "description": "Build a tool that writes a short, four-line poem based on a theme or keyword provided by the user.", "category": "Creative & Fun" },
  { "team_id": "B7C1D", "ps_id": "EDU06", "title": "Analogy Creator", "description": "Develop a tool that helps explain complex technical concepts by generating simple analogies. For example, 'A CPU is like the brain of the computer'.", "category": "Education" },
  { "team_id": "E4F8G", "ps_id": "PROD06", "title": "Bug Report Formatter", "description": "Create an app where a user describes a software bug in plain language, and the AI formats it into a structured bug report with steps to reproduce.", "category": "Productivity" },
  { "team_id": "H5I9J", "ps_id": "HEALTH06", "title": "Digital Detox Suggester", "description": "Build a tool that suggests simple, offline activities (like 'go for a walk', 'read a book for 15 minutes') to help users reduce their screen time.", "category": "Health & Wellness" },
  { "team_id": "K2L6M", "ps_id": "LOCAL06", "title": "Lost and Found Pet Alerter", "description": "Design a system where a user can report a lost or found pet with a photo and location, and the AI helps generate a shareable social media post.", "category": "Local Community" },
  { "team_id": "N3O7P", "ps_id": "SUS06", "title": "Carbon Footprint Calculator", "description": "Create a simple questionnaire-based tool that asks about daily travel and diet to give a user an estimated carbon footprint score.", "category": "Sustainability" },
  { "team_id": "Q1R4S", "ps_id": "CREATIVE06", "title": "Excuse Generator", "description": "A fun, lighthearted tool that generates creative (but obviously fake) excuses for being late to a meeting or missing a deadline.", "category": "Creative & Fun" },
  { "team_id": "T8U5V", "ps_id": "ACC03", "title": "Color Descriptor", "description": "Build an app that uses the phone's camera to identify a color in front of it and describes it using both its name (e.g., 'Royal Blue') and descriptive terms (e.g., 'a deep, dark blue like the ocean').", "category": "Accessibility" },
  { "team_id": "W9X2Y", "ps_id": "EDU07", "title": "Concept Map Generator", "description": "Create a tool that takes a central topic and generates a simple mind map or concept map of related ideas and sub-topics to aid in brainstorming.", "category": "Education" }
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

