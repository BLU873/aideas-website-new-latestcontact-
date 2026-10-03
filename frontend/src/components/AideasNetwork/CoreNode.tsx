'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import logoImg from '@/components/logo.png';

export interface CoreNodeData {
  name: string;
  role: string;
  isHovered?: boolean;
  isDimmed?: boolean;
}

function CoreNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as CoreNodeData;

  return (
    <div
      className={`network-node-wrapper relative group select-none ${
        nodeData.isDimmed ? 'dimmed' : ''
      } ${nodeData.isHovered ? 'highlighted' : ''}`}
    >
      {/* Node Pill Container - BIG RECTANGLE BADGE */}
      <div className="relative w-[300px] sm:w-[360px] px-7 py-5 rounded-3xl bg-[#09090b] border-2 border-blue-500/80 shadow-[0_0_45px_rgba(59,130,246,0.6)] flex items-center gap-5 transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400 group-hover:shadow-[0_0_60px_rgba(59,130,246,0.8)]">
        {/* Logo / Central Badge */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1.5 bg-black border-2 border-blue-400/80 flex items-center justify-center shrink-0 shadow-lg">
          <Image
            src={logoImg}
            alt="aIDEAS Logo"
            width={64}
            height={64}
            className="rounded-xl object-contain"
          />
        </div>

        {/* Text Details */}
        <div className="text-left flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {nodeData.name}
            </span>
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse shrink-0" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-blue-400 tracking-wide mt-1">
            {nodeData.role}
          </p>
        </div>
      </div>

      {/* Target Handle from Title Node (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!bg-blue-500 !w-3 !h-3 opacity-0"
      />

      {/* Connection Handle to HOD Node (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-blue-500 !w-3 !h-3"
      />
    </div>
  );
}

export const CoreNode = memo(CoreNodeComponent);
export default CoreNode;

export const TeamTitleNodeComponent = memo(function TeamTitleNode() {
  return (
    <div className="flex flex-col items-center justify-center select-none pointer-events-none -translate-x-1/2 left-1/2 relative py-4">
      {/* Small Eyebrow Badge */}
      <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-blue-950/90 border border-blue-400/60 text-blue-300 text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_25px_rgba(59,130,246,0.5)] backdrop-blur-xl mb-3">
        <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
        <span>Official Association Network</span>
      </div>

      {/* Grand Title: WE ARE TEAM aIDEAS */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-100 to-purple-400 tracking-tighter drop-shadow-[0_0_45px_rgba(59,130,246,0.9)] text-center whitespace-nowrap uppercase">
        WE ARE TEAM aIDEAS
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base font-bold text-zinc-300 mt-2 tracking-[0.2em] uppercase text-center drop-shadow-md">
        Artificial Intelligence & Data Science Student Association
      </p>

      {/* Source Handle pointing down to aIDEAS hub */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-blue-500 !w-3 !h-3 opacity-0"
      />
    </div>
  );
});
