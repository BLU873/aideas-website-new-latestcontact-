'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { NETWORK_DATA, Member } from './networkData';
import { FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { 
  Mail, 
  Sparkles, 
  Code, 
  Palette, 
  Calendar, 
  Megaphone, 
  Video, 
  DollarSign, 
  BookOpen, 
  UserCheck, 
  Crown,
  ChevronRight,
  User
} from 'lucide-react';

interface MobileTeamViewProps {
  onSelectMember: (member: Member) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Teams' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'events-finance', label: 'Events & Finance' },
  { id: 'technical', label: 'Web & Tech' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'design', label: 'Design' },
  { id: 'media', label: 'Media & Editorial' },
];

export default function MobileTeamView({ onSelectMember }: MobileTeamViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeExpandedCardId, setActiveExpandedCardId] = useState<string | null>(null);

  // Interactive Cursor Spotlight Mouse Position Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Group members into structured sections
  const teamSections = useMemo(() => {
    const allMembers: { category: string; sectionTitle: string; members: Member[] }[] = [
      {
        category: 'leadership',
        sectionTitle: 'Executive Board',
        members: NETWORK_DATA.leadership.filter((m) => m.role.includes('Secretary')),
      },
      {
        category: 'faculty',
        sectionTitle: 'HOD & Faculty Coordinators',
        members: NETWORK_DATA.leadership.filter((m) => m.role.includes('Head') || m.role.includes('Faculty')),
      },
      {
        category: 'events-finance',
        sectionTitle: 'Events & Finance Team',
        members: NETWORK_DATA.heads.filter((m) => 
          m.department.toLowerCase().includes('events') || 
          m.department.toLowerCase().includes('finance') ||
          m.role.toLowerCase().includes('treasurer')
        ),
      },
      {
        category: 'technical',
        sectionTitle: 'Web & Technical Team',
        members: NETWORK_DATA.heads.filter((m) => m.department.toLowerCase().includes('technical')),
      },
      {
        category: 'marketing',
        sectionTitle: 'Marketing & Outreach Team',
        members: NETWORK_DATA.heads.filter((m) => m.department.toLowerCase().includes('marketing')),
      },
      {
        category: 'design',
        sectionTitle: 'Design & UI/UX Team',
        members: NETWORK_DATA.heads.filter((m) => m.department.toLowerCase().includes('design')),
      },
      {
        category: 'media',
        sectionTitle: 'Media & Editorial Team',
        members: NETWORK_DATA.heads.filter((m) => 
          m.department.toLowerCase().includes('media') || 
          m.department.toLowerCase().includes('editorial')
        ),
      },
    ];

    if (selectedCategory === 'all') {
      // Exclude 'faculty' section from "All Teams" tab per user request
      return allMembers.filter((section) => section.category !== 'faculty' && section.members.length > 0);
    }

    return allMembers.filter(
      (section) => section.category === selectedCategory && section.members.length > 0
    );
  }, [selectedCategory]);

  return (
    <div className="w-full bg-[#020712] text-white min-h-screen pb-28 relative overflow-hidden font-sans">
      {/* Brand Theme Ambient Glows (Cyan + Purple + Obsidian) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-[#00d8ff]/20 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 -right-20 w-96 h-96 bg-[#a855f7]/20 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-10 left-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-[110px]"
        />
      </div>

      <div className="relative z-10 px-4 pt-6">
        {/* Mobile Header Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-black font-[family-name:var(--font-orbitron)] tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#a855f7] to-[#e879f9] drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
            TEAM <span className="lowercase text-[#38bdf8]">a</span>IDEAS
          </h1>
          <p className="text-[11px] font-mono tracking-widest text-zinc-300 uppercase mt-1.5 max-w-xs mx-auto">
            AI &amp; Data Science Student Association
          </p>
        </motion.div>

        {/* Theme Pill Filter Carousel - Pure Text */}
        <div className="mb-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
          <div className="flex items-center gap-2.5 w-max pb-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;

              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative flex items-center px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shrink-0 border ${
                    isActive
                      ? 'bg-[#38bdf8] text-black border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.6)] scale-105'
                      : 'bg-[#0b0821]/80 text-purple-200/90 border border-purple-500/40 hover:text-white hover:border-[#38bdf8]'
                  }`}
                >
                  <span>{cat.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Team Section Blocks */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-10"
          >
            {teamSections.map((section, idx) => (
              <div key={`${section.category}-${idx}`} className="space-y-4">
                {/* Section Header - Pure Text */}
                <motion.div 
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-between border-b border-[#38bdf8]/20 pb-2.5"
                >
                  <h2 className="text-lg font-bold font-[family-name:var(--font-orbitron)] text-zinc-100 tracking-wider">
                    {section.sectionTitle}
                  </h2>
                </motion.div>

                {/* Grid of CodePen Aspect-Ratio Shift & Text Reveal Animated Cards */}
                <div className="grid grid-cols-1 gap-6">
                  {section.members.map((member, mIdx) => {
                    const isExpanded = activeExpandedCardId === member.id;

                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 80, scale: 0.92 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ 
                          duration: 0.55, 
                          delay: (mIdx % 3) * 0.12, 
                          ease: [0.215, 0.61, 0.355, 1.0] 
                        }}
                        onMouseMove={handleMouseMove}
                        onClick={() => {
                          setActiveExpandedCardId(isExpanded ? null : member.id);
                          onSelectMember(member);
                        }}
                        className={`group relative bg-gradient-to-b from-[#0b132b] via-[#070e21] to-[#030712] border border-[#38bdf8]/30 hover:border-[#38bdf8] rounded-[2rem] p-2 overflow-hidden shadow-[0_10px_30px_rgba(2,7,18,0.9)] hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] transition-all duration-500 ease-out cursor-pointer ${
                          isExpanded ? 'border-[#38bdf8] shadow-[0_0_35px_rgba(56,189,248,0.5)]' : ''
                        }`}
                      >
                        {/* Dynamic Cursor Spotlight Radial Light Overlay */}
                        <div 
                          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                          style={{
                            background: 'radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(56, 189, 248, 0.2), transparent 75%)',
                          }}
                        />

                        {/* Crisp Dynamic Aspect-Ratio Shrinking Image Container */}
                        <div className={`w-full overflow-hidden rounded-[1.5rem] relative transition-all duration-500 ease-out ${
                          isExpanded ? 'aspect-[1/1]' : 'aspect-[2/3] group-hover:aspect-[1/1]'
                        }`}>
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover object-[50%_5%] group-hover:object-[50%_15%] transition-all duration-500 ease-out"
                            sizes="(max-width: 640px) 100vw, 400px"
                            priority={false}
                          />
                        </div>

                        {/* CodePen Animated Reveal Text Section */}
                        <div className="p-4 flex flex-col justify-between relative z-20">
                          {/* Member Name (CodePen h2) */}
                          <h2 className="text-2xl font-black text-white font-[family-name:var(--font-orbitron)] tracking-wide group-hover:text-[#38bdf8] transition-colors duration-300 m-0">
                            {member.name}
                          </h2>

                          {/* Member Role Subtitle */}
                          <div className="mt-1">
                            <span className="text-xs font-bold text-[#38bdf8] font-mono tracking-[0.2em] uppercase">
                              {member.role}
                            </span>
                          </div>

                          {/* Member Bio Paragraph */}
                          <p className="text-xs text-zinc-300 leading-relaxed mt-2 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                            {member.bio || `${member.name} is a key leader in the ${member.department} department driving aIDEAS initiatives.`}
                          </p>

                          {/* Card Action Row (Department Tag + Contact Buttons) */}
                          <div className="pt-3 mt-3 flex items-center justify-between border-t border-[#38bdf8]/20 w-full">
                            {/* Left Tag / Department */}
                            <div className="text-[11px] font-mono text-purple-300 flex items-center gap-1.5 font-bold">
                              <User className="w-3.5 h-3.5 text-[#38bdf8]" />
                              <span>{member.department}</span>
                            </div>

                            {/* Right Action Contact Buttons */}
                            <div className="flex items-center gap-2">
                              {member.instagram && (
                                <motion.a
                                  href={member.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-9 h-9 rounded-xl bg-[#180d38] border border-[#a855f7]/50 flex items-center justify-center text-[#a855f7] hover:bg-[#a855f7] hover:text-white transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                                  title="Instagram"
                                >
                                  <FaInstagram className="w-4 h-4" />
                                </motion.a>
                              )}

                              {member.email && (
                                <motion.a
                                  href={`mailto:${member.email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-9 h-9 rounded-xl bg-[#38bdf8] text-black flex items-center justify-center font-bold hover:bg-cyan-300 transition-all shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                                  title="Email"
                                >
                                  <Mail className="w-4 h-4" />
                                </motion.a>
                              )}

                              {member.linkedin && (
                                <motion.a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-9 h-9 rounded-xl bg-[#180d38] border border-[#a855f7]/50 flex items-center justify-center text-[#a855f7] hover:bg-[#a855f7] hover:text-white transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                                  title="LinkedIn"
                                >
                                  <FaLinkedinIn className="w-4 h-4" />
                                </motion.a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
