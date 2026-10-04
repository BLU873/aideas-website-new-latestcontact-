'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, Mail } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa';
import { NETWORK_DATA, Member } from '@/components/AideasNetwork/networkData';

export default function MembersGlobePage() {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [imgErrors, setImgErrors] = useState<{ [key: string]: boolean }>({});

  const allMembers: Member[] = [...NETWORK_DATA.leadership, ...NETWORK_DATA.heads];

  const departments = ['All', ...Array.from(new Set(allMembers.map((m) => m.department).filter(Boolean)))];

  const filteredMembers = selectedDept === 'All'
    ? allMembers
    : allMembers.filter((m) => m.department === selectedDept);

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 sm:p-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navigation */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-10">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 hover:text-white hover:bg-blue-600 transition-all text-xs font-bold shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 2D Story Graph</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/40 bg-black/90 text-blue-300 text-xs font-semibold uppercase tracking-widest shadow-lg">
          <Globe className="w-4 h-4 text-purple-400" />
          <span>aIDEAS Global Directory</span>
        </div>
      </div>

      {/* Header Title */}
      <div className="relative z-10 max-w-7xl mx-auto text-center space-y-4 mb-12">
        <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 tracking-tight">
          Team Network Overview
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          The complete ecosystem of student leadership, department heads, and technical coordinators representing AI & Data Science at PVG.
        </p>

        {/* Filter Pills */}
        <div className="pt-4 flex flex-wrap justify-center gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedDept === dept
                  ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member) => {
          const hasError = imgErrors[member.id];
          const initial = member.name ? member.name.charAt(0).toUpperCase() : 'A';

          return (
            <div
              key={member.id}
              className="group relative bg-[#09090b] border border-zinc-800 hover:border-blue-500/60 rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(59,130,246,0.25)] flex flex-col justify-between"
            >
              <div>
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 border-blue-500/50 group-hover:border-blue-400 transition-colors bg-gradient-to-br from-blue-900 to-zinc-900 flex items-center justify-center">
                    {!hasError ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        onError={() => handleImgError(member.id)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black text-white">{initial}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white group-hover:text-blue-300 transition-colors leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold text-blue-400 mt-1">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                  &quot;{member.bio}&quot;
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                  {member.department}
                </span>

                <div className="flex items-center gap-2">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-900 text-blue-400 hover:text-white hover:bg-blue-600 transition-all"
                      title="LinkedIn"
                    >
                      <FaLinkedinIn className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 rounded-lg bg-zinc-900 text-blue-400 hover:text-white hover:bg-blue-600 transition-all"
                      title="Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
