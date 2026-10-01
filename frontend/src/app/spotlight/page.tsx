/*
"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import { motion } from "framer-motion";

const events = [
  {
    title: "Avinya",
    date: "5th May 2023",
    description: "Group of events taken in this",
    image: "/Avinya.png",
    longDescription: " Avinya – A Celebration of Innovation and Talent  Avinya was a flagship event organized by the aIDEAS Student Association at PVG's College of Engineering and Technology, bringing together students from diverse backgrounds to engage in a variety of technical and non-technical activities on campus.The event served as a vibrant platform for students to showcase their creativity, collaborate with peers, and step beyond academics to explore new dimensions of learning and fun. From planning to participation, Avinya successfully fostered a sense of community, innovation, and enthusiasm among all involved. It was not just an event — it was an experience that celebrated ideas, talent, and togetherness.  "
  },
  {
    title: "Murder Mystery",
    date: "5th May 2023",
    description: "A thrilling problem-solving challenge.",
    image: "/mystry.png",
    longDescription: "Our 'Murder Mystery' event challenged participants to put on their detective hats. Teams worked together to analyze clues, interrogate virtual suspects, and solve a complex fictional crime. This event was designed to promote critical thinking, teamwork, and deductive reasoning in a fun and engaging format."
  },
  {
    title: "Tug of War",
    date: "5th May 2023",
    description: "A classic test of strength and teamwork.",
    image: "/war.png",
    longDescription: "More than just a physical contest, the annual Tug of War brought students and faculty together for a spirited competition. It emphasized collaboration, strategy, and collective effort, proving that strength lies in unity. The event was a highlight of our college fest, fostering a sense of community and friendly rivalry."
  },
  {
    title: "Escape Room",
    date: "5th May 2023",
    description: "An immersive puzzle-solving adventure.",
    image: "/Room.png",
    longDescription: "The Escape Room event locked teams in a themed room with a series of intricate puzzles and hidden clues. They had to race against the clock to solve the mysteries and find the key to escape. This activity tested problem-solving skills, communication under pressure, and attention to detail."
  },
  {
    title: "Salvation Army Visit",
    date: "18th Oct 2023",
    description: "A day of community service and giving back.",
    image: "/army.png",
    longDescription: "Our visit to the Salvation Army was a heartwarming experience focused on community outreach. Volunteers spent the day assisting with daily operations, organizing donations, and interacting with the residents. This event underscored our commitment to social responsibility and making a positive impact beyond our campus."
  },
  {
    title: "Masterchef PVG",
    date: "17th Oct 2023",
    description: "A culinary competition for food lovers.",
    image: "/vlog.JPG",
    longDescription: "Masterchef PVG was a delicious showdown where our campus's best amateur chefs competed. Participants were challenged with mystery boxes and technical skills tests, showcasing their creativity and culinary talent to a panel of judges. The aroma of competition and great food filled the air!"
  },
  {
    title: "Googler Talk",
    date: "17th Oct 2023",
    description: "Insights from an industry expert on AI.",
    image: "/Goo.JPG",
    longDescription: "We had the honor of hosting a senior software engineer from Google for an inspiring talk on the future of Artificial Intelligence. The speaker shared valuable insights into current industry trends, career pathways in AI/ML, and the ethical considerations shaping the future of technology. The session concluded with an interactive Q&A."
  },
  {
    title: "Flip the Code",
    date: "5th Jan 2024",
    description: "An unconventional coding challenge.",
    image: "/FLIP.jpg",
    longDescription: "'Flip the Code' turned traditional coding competitions on their head. Participants were given a working piece of code and its output, but with the logic flipped or reversed. Their task was to debug and reconstruct the original logic, testing their understanding of code flow and problem-solving from a different perspective."
  },
  {
    title: "Code Clash",
    date: "2nd April 2025",
    description: "A competitive programming showdown.",
    image: "/code.png",
    longDescription: "Code Clash is our flagship annual coding competition, attracting the brightest minds to solve a series of complex algorithmic problems. Contestants compete in a high-stakes environment to write efficient and accurate code under tight deadlines, battling for prizes and bragging rights as the top coder on campus."
  },
];

type Event = (typeof events)[0];

export default function EventsPage() {
  const titleRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    gsap.from(titleRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-purple-900 to-black py-10 overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] animate-[moveStars_50s_linear_infinite]" />
        <style jsx>{`
          @keyframes moveStars {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 1000px 1000px;
            }
          }
        `}</style>
      </div>

      <main className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto">
        <h1
          ref={titleRef}
          className="page-title text-3xl sm:text-5xl font-bold mb-12 text-center text-gradient bg-gradient-to-r from-purple-600 via-pink-500 to-red-400 bg-clip-text text-transparent"
        >
          Our Past Events
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-black/60 border border-fuchsia-700 rounded-2xl overflow-hidden 
              md:shadow-none md:hover:scale-105 md:hover:border-cyan-400 md:hover:shadow-[0_0_20px_#0ff] 
              transition-all duration-300"
            >
              <EventCard {...event} onLearnMore={() => handleOpenModal(event)} />
            </motion.div>
          ))}
        </div>
      </main>

      {selectedEvent && <EventModal event={selectedEvent} onClose={handleCloseModal} />}
    </div>
  );
}
*/


/*NEW PAGE 1*/

/*'use client';

import React, { useState } from 'react';

// Achievements Data Structure
const achievementsData = [
  {
    id: 1,
    students: ['Padmaraj Pawar', 'Aditya Tilekar', 'Aariya Vora', 'Aishwarya Kavhekar', 'Krish Chobe'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: '3rd Position at PICT IMPETUS Project Exhibition',
    details: 'Domain: Digital Image/Speech/Video Processing. Project: VoiceShield - A Real-Time Hybrid AI Framework for Detecting Generative Voice-Cloning and Scam Intent.',
    badge: 'Exhibition Winner'
  },
  {
    id: 2,
    students: ['Padmaraj Pawar'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: 'Bhagirath Karandak Award',
    details: 'Team member (Actor) in award-winning performance at the prestigious Purushottam Karandak Competition.',
    badge: 'Cultural'
  },
  {
    id: 3,
    students: ['Soham Mule', 'Aditya Ajay Tilekar', 'Komal'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: 'Winners - VOIS INNOVATION MARATHON 2.0',
    details: 'Built a centralized urban mobility solution helping users select optimized routes to solve urban commute problems.',
    badge: 'Hackathon Winner'
  },
  {
    id: 4,
    students: ['Soham Mule', 'Aditya Ajay Tilekar', 'Komal'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: '2nd Rank - IBM SkillsBuild Hacknexus 2025',
    details: 'Secured 2nd rank at IBM SkillsBuild Hacknexus 2025 powered by EDUNET.',
    badge: 'Hackathon Winner'
  },
  {
    id: 5,
    students: ['Saanidhi Gade'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: '3rd Rank - HardHack Forge Hackathon 2026',
    details: 'Developed a Smart Mirror AI Assistant with seamless hardware–ML integration at PCCOE.',
    badge: 'Hackathon Winner'
  }
];

// Timeline Events Data
const timelineEvents = [
  {
    date: 'Sep 2025',
    title: 'Think-Prompt-Build Event',
    description: 'Flagship prompt engineering and rapid AI prototyping competition organized by AiDeas.',
    status: 'Latest'
  },
  {
    date: 'Dec 2025',
    title: 'Event 2 (Upcoming)',
    description: 'Upcoming hands-on workshop on generative AI agents and model evaluation.',
    status: 'Upcoming'
  },
  {
    date: 'Mar 2026',
    title: 'Event 3 (Upcoming)',
    description: 'National level hackathon bringing together AI innovators and builders.',
    status: 'Upcoming'
  }
];

export default function SpotlightPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'achievements'>('events');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');

  const batches = ['All', '2028 (SE)', '2027 (TE)', '2029 (FE)'];

  const filteredAchievements = selectedBatch === 'All'
    ? achievementsData
    : achievementsData.filter(item => item.batch === selectedBatch);

  return (
    <div className="min-h-screen bg-[#05050A] text-white pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Spotlight
        </h1>
        <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
          Highlighting our key historical events, upcoming initiatives, and major student achievements.
        </p>

        <div className="flex justify-center mt-8">
          <div className="bg-[#0D0D18] p-1.5 rounded-full border border-gray-800 flex gap-2">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Events Timeline
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'achievements'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Major Achievements
            </button>
          </div>
        </div>
      </div>

      
      {activeTab === 'events' && (
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-cyan-300">
            Key Historical Milestones & Upcoming Events
          </h2>

          <div className="relative border-l-2 border-purple-900/60 ml-4 md:ml-32 pl-6 md:pl-10 space-y-12">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative group">
                
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full border-2 border-purple-500 bg-[#0A0A14] group-hover:bg-purple-600 group-hover:scale-125 transition-all duration-300 flex items-center justify-center shadow-md shadow-purple-500/50">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                </div>

                
                <div className="bg-[#0B0C16] border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-bold text-purple-400 tracking-wider">
                      {event.date}
                    </span>
                    {event.status === 'Latest' ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {event.status}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                        {event.status}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {activeTab === 'achievements' && (
        <div className="mt-8">
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <span className="text-sm text-gray-400 font-medium mr-2">Filter Batch:</span>
            {batches.map((batch) => (
              <button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  selectedBatch === batch
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/30'
                    : 'bg-[#0E0F1D] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                {batch}
              </button>
            ))}
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((item) => (
              <div
                key={item.id}
                className="bg-[#0B0C16] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/10 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/50">
                      Academic Year 2025-26
                    </span>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {item.batch}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                    {item.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-800/80 mt-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Student / Team:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.students.map((student, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium bg-[#14162B] text-gray-200 px-2.5 py-1 rounded-md border border-gray-700/50"
                      >
                        {student}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

*/

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Achievements Data Structure
const achievementsData = [
  {
    id: 1,
    students: ['Padmaraj Pawar', 'Aditya Tilekar', 'Aariya Vora', 'Aishwarya Kavhekar', 'Krish Chobe'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: '3rd Position at PICT IMPETUS Project Exhibition',
    details: 'Domain: Digital Image/Speech/Video Processing. Project: VoiceShield - A Real-Time Hybrid AI Framework for Detecting Generative Voice-Cloning and Scam Intent.',
    badge: 'Exhibition Winner'
  },
  {
    id: 2,
    students: ['Padmaraj Pawar'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: 'Bhagirath Karandak Award',
    details: 'Team member (Actor) in award-winning performance at the prestigious Purushottam Karandak Competition.',
    badge: 'Cultural'
  },
  {
    id: 3,
    students: ['Soham Mule', 'Aditya Ajay Tilekar', 'Komal'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: 'Winners - VOIS INNOVATION MARATHON 2.0',
    details: 'Built a centralized urban mobility solution helping users select optimized routes to solve urban commute problems.',
    badge: 'Hackathon Winner'
  },
  {
    id: 4,
    students: ['Soham Mule', 'Aditya Ajay Tilekar', 'Komal'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: '2nd Rank - IBM SkillsBuild Hacknexus 2025',
    details: 'Secured 2nd rank at IBM SkillsBuild Hacknexus 2025 powered by EDUNET.',
    badge: 'Hackathon Winner'
  },
  {
    id: 5,
    students: ['Saanidhi Gade'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: '3rd Rank - HardHack Forge Hackathon 2026',
    details: 'Developed a Smart Mirror AI Assistant with seamless hardware–ML integration at PCCOE.',
    badge: 'Hackathon Winner'
  }
];

// Timeline Events Data
const timelineEvents = [
  {
    date: 'Sep 2025',
    title: 'Think-Prompt-Build Event',
    description: 'Flagship prompt engineering and rapid AI prototyping competition organized by AiDeas.',
    status: 'Latest'
  },
  {
    date: 'Dec 2025',
    title: 'Event 2 (Upcoming)',
    description: 'Upcoming hands-on workshop on generative AI agents and model evaluation.',
    status: 'Upcoming'
  },
  {
    date: 'Mar 2026',
    title: 'Event 3 (Upcoming)',
    description: 'National level hackathon bringing together AI innovators and builders.',
    status: 'Upcoming'
  }
];

export default function SpotlightPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'achievements'>('events');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');

  const batches = ['All', '2028 (SE)', '2027 (TE)', '2029 (FE)'];

  const filteredAchievements = selectedBatch === 'All'
    ? achievementsData
    : achievementsData.filter(item => item.batch === selectedBatch);

  return (
    <div className="relative min-h-screen bg-[#030308] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            Spotlight
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg"
          >
            Highlighting our key historical events, upcoming initiatives, and major student achievements.
          </motion.p>

          {/* Tab Switcher */}
          <div className="flex justify-center mt-8">
            <div className="bg-[#0A0B16] p-1.5 rounded-full border border-gray-800/80 shadow-inner flex gap-2">
              <button
                onClick={() => setActiveTab('events')}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'events'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {activeTab === 'events' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg shadow-purple-500/25"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Events Timeline</span>
              </button>

              <button
                onClick={() => setActiveTab('achievements')}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'achievements'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {activeTab === 'achievements' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg shadow-purple-500/25"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Major Achievements</span>
              </button>
            </div>
          </div>
        </div>

        {/* EVENTS TAB CONTENT */}
        {activeTab === 'events' && (
          <div className="mt-12 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-14 text-cyan-300 tracking-wide">
              Key Historical Milestones & Upcoming Events
            </h2>

            {/* Central Timeline Container */}
            <div className="relative">
              {/* Central Vertical Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-purple-600 to-blue-800 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.5)] hidden md:block" />
              {/* Fallback left line for mobile screens */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-purple-600 to-blue-800 rounded-full md:hidden" />

              <div className="space-y-12 md:space-y-16">
                {timelineEvents.map((event, index) => {
                  const isEven = index % 2 === 0;

                  return (
                    <div key={index} className="relative flex flex-col md:flex-row items-center">
                      {/* Central Glowing Orb Node */}
                      <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 z-20 w-8 h-8 rounded-full border-2 border-purple-400 bg-[#060713] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                      </div>

                      {/* Content Card Wrapper */}
                      <div className={`w-full md:w-1/2 pl-14 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                        <motion.div
                          initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.5, delay: index * 0.15 }}
                          whileHover={{ scale: 1.03, y: -4 }}
                          className="bg-[#090A15]/90 backdrop-blur-md border border-gray-800/90 rounded-2xl p-6 shadow-lg hover:border-purple-500/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-300"
                        >
                          <div className={`flex flex-wrap items-center gap-2 mb-3 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                            <span className="text-sm font-bold text-purple-400 tracking-wider">
                              {event.date}
                            </span>
                            <span className={`px-3 py-0.5 text-xs font-semibold rounded-full border ${
                              event.status === 'Latest' 
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                                : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            }`}>
                              {event.status}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">
                            {event.title}
                          </h3>
                          <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                            {event.description}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS TAB CONTENT */}
        {activeTab === 'achievements' && (
          <div className="mt-8">
            {/* Batch Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <span className="text-sm text-gray-400 font-medium mr-2">Filter Batch:</span>
              {batches.map((batch) => (
                <button
                  key={batch}
                  onClick={() => setSelectedBatch(batch)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                    selectedBatch === batch
                      ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/30'
                      : 'bg-[#090A15] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                  }`}
                >
                  {batch}
                </button>
              ))}
            </div>

            {/* Achievements Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredAchievements.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.04, y: -6 }}
                    className="bg-[#080914]/90 backdrop-blur-md border border-gray-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-md hover:border-purple-500/50 hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/50">
                          Academic Year 2025-26
                        </span>
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/40">
                          {item.batch}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 leading-snug hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                        {item.details}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-800/80 mt-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                        Student / Team:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.students.map((student, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium bg-[#111326] text-gray-200 px-2.5 py-1 rounded-md border border-gray-700/50 hover:border-purple-500/40 transition-colors"
                          >
                            {student}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}