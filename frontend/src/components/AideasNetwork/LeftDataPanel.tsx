'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Quote, ChevronRight } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa';
import { Member } from './networkData';

interface LeftDataPanelProps {
  stageName?: string;
  stageStep?: number;
  totalSteps?: number;
  activeMember: Member | null;
  onOpenModal: (member: Member) => void;
}

export default function LeftDataPanel({
  activeMember,
  onOpenModal,
}: LeftDataPanelProps) {
  const [displayMember, setDisplayMember] = useState<Member | null>(activeMember);
  const [isCrossfading, setIsCrossfading] = useState(false);

  useEffect(() => {
    if (!activeMember) return;
    if (!displayMember || activeMember.id !== displayMember.id) {
      setIsCrossfading(true);
      const timer = setTimeout(() => {
        setDisplayMember(activeMember);
        setIsCrossfading(false);
      }, 70);
      return () => clearTimeout(timer);
    }
  }, [activeMember, displayMember]);

  const currentMember = displayMember || activeMember;
  if (!currentMember) return null;

  return (
    <div className="w-full sm:w-[460px] lg:w-[480px] shrink-0 select-none pointer-events-auto">
      {/* Stable Card Container - No Unmounting/Re-creation of Root Container */}
      <div className="relative bg-[#020f1c]/95 border-2 border-blue-500/60 rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(59,130,246,0.3)] max-h-[38dvh] sm:max-h-none overflow-y-auto [scrollbar-width:thin] group transition-colors duration-300 hover:border-blue-400">
        
        {/* Dynamic Ambient Holographic Glare Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Persistent Inner Wrapper with Fast GPU Crossfade */}
        <div
          className={`flex flex-row gap-2.5 sm:gap-4 items-stretch w-full transition-opacity duration-100 ease-out ${
            isCrossfading ? 'opacity-30' : 'opacity-100'
          }`}
          style={{ willChange: 'opacity' }}
        >
          {/* Vertical Portrait Photo Box on Left */}
          <div
            className="relative w-[95px] sm:w-[175px] shrink-0 rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-800 shadow-xl group-hover:border-blue-400/70 bg-gradient-to-br from-blue-950 to-zinc-900 flex items-center justify-center transition-colors duration-300 min-h-[120px] sm:min-h-[140px]"
          >
            {currentMember.image ? (
              <img
                src={currentMember.image}
                alt={currentMember.name}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-full h-full object-cover object-center"
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-black text-blue-400/80 pointer-events-none -z-10">
              {currentMember.name ? currentMember.name.charAt(0) : 'A'}
            </div>
          </div>

          {/* Member Details on Right */}
          <div
            className="flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-3 min-w-0"
          >
            {/* Header: Name, Role & Department */}
            <div>
              <h3 className="text-base sm:text-2xl font-black text-white tracking-tight leading-tight group-hover:text-blue-200 transition-colors truncate">
                {currentMember.name}
              </h3>
              <p className="text-[11px] sm:text-sm font-extrabold text-blue-400 mt-0.5 sm:mt-1 truncate">
                {currentMember.role}
              </p>
              {currentMember.department && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] sm:text-[10px] font-mono text-zinc-300">
                  {currentMember.department}
                </span>
              )}
            </div>

            {/* Bio / Quote Box */}
            <div className="relative bg-[#09090b] border border-zinc-800/80 rounded-lg sm:rounded-xl p-2 sm:p-3 text-zinc-300 shadow-inner">
              <Quote className="absolute top-1.5 right-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500/20" />
              <p className="text-[10px] sm:text-xs leading-tight sm:leading-relaxed font-normal italic relative z-10 line-clamp-2 sm:line-clamp-3">
                &quot;{currentMember.bio}&quot;
              </p>
            </div>

            {/* Actions: View Full Profile Button & Social Icons */}
            <div className="pt-1.5 sm:pt-2 flex items-center gap-1.5 sm:gap-2 border-t border-zinc-800/80">
              <button
                onClick={() => onOpenModal(currentMember)}
                className="flex-1 py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md active:scale-95 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
              >
                <span className="truncate">View Profile</span>
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              </button>

              {currentMember.linkedin && (
                <a
                  href={currentMember.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-md shrink-0"
                  title="LinkedIn Profile"
                >
                  <FaLinkedinIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </a>
              )}

              {currentMember.email && (
                <a
                  href={`mailto:${currentMember.email}`}
                  className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-md shrink-0"
                  title="Send Email"
                >
                  <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
