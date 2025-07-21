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
    description: "Introduction to cybersecurity principles.",
    image: "/Avinya.png",
    longDescription: "Avinya 2023 was a comprehensive workshop designed to introduce beginners to the fundamental principles of cybersecurity. Attendees learned about common threats, defensive strategies, and the importance of digital hygiene in today's connected world. The session included live demonstrations of ethical hacking techniques and a Q&A with industry professionals."
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
      <main className="px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto">
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
            >
              <EventCard {...event} onLearnMore={() => handleOpenModal(event)} />
            </motion.div>
          ))}
        </div>
      </main>
      
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </>
  );
}