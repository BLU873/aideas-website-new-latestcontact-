'use client';

import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Member } from './networkData';

export interface MemberNodeData {
  member: Member;
  isLeadership?: boolean;
  isActiveFocus?: boolean;
  isHovered?: boolean;
  isDimmed?: boolean;
  idleDelayIndex?: number;
  onSelectMember?: (member: Member) => void;
}

function MemberNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as MemberNodeData;
  const { member, isActiveFocus, isHovered, isDimmed, onSelectMember } = nodeData;

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [member.image]);

  const isMainLeader =
    member.id === 'gs' ||
    member.id === 'jgs' ||
    member.id === 'hod' ||
    member.id === 'coordinator' ||
    member.id === 'coordinator2' ||
    member.role === 'Faculty Coordinator';

  const initial = member.name ? member.name.charAt(0).toUpperCase() : 'A';

  return (
    <div
      onClick={() => onSelectMember?.(member)}
      className={`network-node-wrapper relative group cursor-pointer select-none ${
        isDimmed ? 'dimmed' : ''
      } ${isHovered || isActiveFocus ? 'highlighted z-50' : ''}`}
    >
      {/* Main Node Container */}
      <div
        className={`relative flex flex-col items-center p-3.5 sm:p-4.5 rounded-2xl bg-[#09090b] border transition-all duration-300 ease-out ${
          isActiveFocus
            ? 'scale-108 border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.85)] ring-2 ring-blue-400 z-50'
            : 'group-hover:scale-103 group-hover:border-blue-400/80 group-hover:shadow-xl'
        } ${
          isMainLeader
            ? 'w-[205px] sm:w-[225px] border-blue-500/80 shadow-[0_4px_30px_rgba(59,130,246,0.35)]'
            : 'w-[165px] sm:w-[180px] border-zinc-800 shadow-lg'
        }`}
      >
        {/* Circular Profile Image or Fallback Avatar */}
        <div className="relative mb-2 shrink-0 flex items-center justify-center">
          {!imgError ? (
            <img
              src={member.image}
              alt={member.name}
              onError={() => setImgError(true)}
              className={`rounded-full object-cover object-center transition-all duration-300 ${
                isMainLeader
                  ? 'w-16 h-16 sm:w-18 sm:h-18 border-2 border-blue-400 group-hover:border-white shadow-md'
                  : 'w-13 h-13 sm:w-15 sm:h-15 border-2 border-zinc-700 group-hover:border-blue-400 shadow-sm'
              }`}
            />
          ) : (
            <div
              className={`rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center font-black text-white shadow-md border-2 border-blue-400 ${
                isMainLeader
                  ? 'w-16 h-16 sm:w-18 sm:h-18 text-2xl'
                  : 'w-13 h-13 sm:w-15 sm:h-15 text-xl'
              }`}
            >
              {initial}
            </div>
          )}
        </div>

        {/* Member Name */}
        <h4 className="text-xs sm:text-sm font-black text-white text-center leading-tight tracking-tight group-hover:text-blue-300 transition-colors">
          {member.name}
        </h4>

        {/* Member Role */}
        <p className="text-[11px] sm:text-xs font-bold text-blue-400 text-center mt-1 leading-snug">
          {member.role}
        </p>

        {/* Department Label */}
        {member.department && (
          <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] font-mono text-zinc-300">
            {member.department}
          </span>
        )}
      </div>

      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} id="target-top" className="!bg-blue-500" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" className="!bg-blue-500" />
      <Handle type="target" position={Position.Left} id="target-left" className="!bg-blue-500" />
      <Handle type="target" position={Position.Right} id="target-right" className="!bg-blue-500" />

      <Handle type="source" position={Position.Top} id="source-top" className="!bg-blue-500" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="!bg-blue-500" />
      <Handle type="source" position={Position.Left} id="source-left" className="!bg-blue-500" />
      <Handle type="source" position={Position.Right} id="source-right" className="!bg-blue-500" />
    </div>
  );
}

export default memo(MemberNodeComponent);
