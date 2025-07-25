"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Event = {
  title: string;
  date: string;
  longDescription: string;
  image: string;
};

type EventModalProps = {
  event: Event;
  onClose: () => void;
};

export default function EventModal({ event, onClose }: EventModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      >
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="relative h-56 sm:h-81">
             <Image
                src={event.image}
                alt={`Image for ${event.title}`}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg h-81"
             />
             <button 
                onClick={onClose} 
                className="absolute top-3 right-3 bg-white rounded-full p-2 text-black hover:bg-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
          <div className="p-6">
            <h2 className="text-3xl font-bold text-black mb-2">{event.title}</h2>
            <p className="text-sm text-purple-500 font-semibold mb-4">{event.date}</p>
            <p className="text-black leading-relaxed">
              {event.longDescription}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}