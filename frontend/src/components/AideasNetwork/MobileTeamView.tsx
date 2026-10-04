'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { NETWORK_DATA, Member } from './networkData';
import { 
  Mail, 
  Linkedin, 
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
  Share2
} from 'lucide-react';

interface MobileTeamViewProps {
  onSelectMember: (member: Member) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Teams', icon: Sparkles },
  { id: 'leadership', label: 'Leadership', icon: Crown },
  { id: 'technical', label: 'Web & Tech', icon: Code },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'media', label: 'Media', icon: Video },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'editorial', label: 'Editorial', icon: BookOpen },
];

export default function MobileTeamView({ onSelectMember }: MobileTeamViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Group members into structured sections
  const teamSections = useMemo(() => {
    const allMembers: { category: string; sectionTitle: string; members: Member[] }[] = [
      {
        category: 'leadership',
        sectionTitle: 'Faculty Leadership',
        members: NETWORK_DATA.leadership.filter((m) => m.role.includes('Head') || m.role.includes('Faculty')),
      },
      {
        category: 'leadership',
        sectionTitle: 'Executive Board',
        members: NETWORK_DATA.leadership.filter((m) => m.role.includes('Secretary')),
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
        category: 'events',
        sectionTitle: 'Event Management Team',
        members: NETWORK_DATA.heads.filter((m) => m.department.toLowerCase().includes('events')),
      },
      {
        category: 'media',
        sectionTitle: 'Media & Production Team',
        members: NETWORK_DATA.heads.filter((m) => m.department.toLowerCase().includes('media')),
      },
      {
        category: 'finance',
        sectionTitle: 'Finance & Treasury Team',
        members: NETWORK_DATA.heads.filter((m) => m.department.toLowerCase().includes('finance')),
      },
      {
        category: 'editorial',
        sectionTitle: 'Editorial & Content Team',
        members: NETWORK_DATA.heads.filter((m) => m.department.toLowerCase().includes('editorial')),
      },
    ];

    if (selectedCategory === 'all') {
      return allMembers.filter((section) => section.members.length > 0);
    }

    return allMembers.filter(
      (section) => section.category === selectedCategory && section.members.length > 0
    );
  }, [selectedCategory]);

  return (
    <div className="w-full bg-[#030614] text-white min-h-screen pb-24 relative overflow-hidden">
      {/* Background Ambient Radial Blue & Purple Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 px-4 pt-6">
        {/* Mobile Title Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3 backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>OUR TEAMS &amp; LEADERSHIP</span>
          </div>
          <h1 className="text-2xl font-black font-[family-name:var(--font-orbitron)] tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]">
            TEAM <span className="lowercase text-cyan-400">a</span>IDEAS
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            Meet the innovators, leaders, and creators driving AI &amp; Data Science excellence
          </p>
        </div>

        {/* Category Pill Buttons Horizontal Carousel */}
        <div className="mb-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
          <div className="flex items-center gap-2 w-max pb-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shrink-0 border ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-400/50 shadow-[0_0_15px_rgba(147,51,234,0.5)] scale-105'
                      : 'bg-[#0a071f]/80 text-zinc-400 border-purple-900/40 hover:text-white hover:bg-purple-950/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Team Sections & Member Cards */}
        <div className="space-y-10">
          {teamSections.map((section, idx) => (
            <div key={`${section.category}-${idx}`} className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-3 border-b border-purple-900/30 pb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <h2 className="text-lg font-bold font-[family-name:var(--font-orbitron)] text-zinc-100 tracking-wider">
                  {section.sectionTitle}
                </h2>
              </div>

              {/* Grid of Member Cards matching screenshot layout */}
              <div className="grid grid-cols-1 gap-6">
                {section.members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => onSelectMember(member)}
                    className="group relative bg-[#0c081f] border border-purple-900/40 hover:border-purple-500/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 active:scale-[0.98] cursor-pointer"
                  >
                    {/* Top Portrait Image Container */}
                    <div className="relative w-full aspect-[4/5] bg-gradient-to-b from-purple-950/20 to-[#0c081f] overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 400px"
                        priority={false}
                      />
                      
                      {/* Gradient overlay for text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c081f] via-transparent to-black/20" />

                      {/* Floating Badge / Action Button Overlay on image (matching screenshot 2 overlay icon) */}
                      <div className="absolute bottom-3 right-3 z-10">
                        <div className="w-10 h-10 rounded-full bg-[#160e33]/90 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-xl backdrop-blur-md">
                          {member.email ? (
                            <Mail className="w-4 h-4 text-purple-300" />
                          ) : (
                            <Megaphone className="w-4 h-4 text-purple-300" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Below Image Card Content */}
                    <div className="px-5 pt-4 pb-6 text-center flex flex-col items-center">
                      {/* Name */}
                      <h3 className="text-xl font-extrabold text-white tracking-wide font-[family-name:var(--font-orbitron)]">
                        {member.name}
                      </h3>

                      {/* Role Pill Badge */}
                      <div className="mt-1.5 inline-block">
                        <span className="text-[11px] font-bold text-purple-400 tracking-[0.2em] uppercase">
                          {member.role}
                        </span>
                      </div>

                      {/* Horizontal Divider Line */}
                      <div className="w-4/5 h-[1px] bg-purple-950/80 my-4" />

                      {/* Bottom Circular Action Buttons */}
                      <div className="flex items-center gap-3">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-10 h-10 rounded-full bg-[#180e3b] border border-purple-500/30 flex items-center justify-center text-purple-300 hover:bg-purple-600 hover:text-white transition-colors shadow-md"
                            title="Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}

                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-10 h-10 rounded-full bg-[#180e3b] border border-purple-500/30 flex items-center justify-center text-purple-300 hover:bg-purple-600 hover:text-white transition-colors shadow-md"
                            title="LinkedIn"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}

                        {!member.email && !member.linkedin && (
                          <button
                            type="button"
                            className="w-10 h-10 rounded-full bg-[#180e3b] border border-purple-500/30 flex items-center justify-center text-purple-300"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
