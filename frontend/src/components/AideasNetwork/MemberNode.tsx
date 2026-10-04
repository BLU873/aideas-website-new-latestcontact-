'use client';

import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Member } from './networkData';
import { useActiveNode } from './ActiveNodeContext';

export interface MemberNodeData {
  member: Member;
  isLeadership?: boolean;
  idleDelayIndex?: number;
  onSelectMember?: (member: Member) => void;
}

const CONNECTIVITY_MAP: Record<string, Set<string>> = {
  aideas: new Set(['hod']),
  hod: new Set(['aideas', 'coordinator', 'coordinator2']),
  coordinator: new Set(['hod', 'gs']),
  coordinator2: new Set(['hod', 'jgs']),
  gs: new Set(['coordinator', 'nishi_treasurer', 'arnav_media', 'atharva_media', 'manish_marketing', 'sanket_desig', 'kinjal_desig']),
  jgs: new Set(['coordinator2', 'pranshu_em', 'anvi_event', 'kush_marketing', 'priti_edito', 'aa_th', 'divesh_th', 'pk_th']),
  nishi_treasurer: new Set(['gs']),
  arnav_media: new Set(['gs']),
  atharva_media: new Set(['gs']),
  manish_marketing: new Set(['gs']),
  sanket_desig: new Set(['gs']),
  kinjal_desig: new Set(['gs']),
  pranshu_em: new Set(['jgs']),
  anvi_event: new Set(['jgs']),
  kush_marketing: new Set(['jgs']),
  priti_edito: new Set(['jgs']),
  aa_th: new Set(['jgs']),
  divesh_th: new Set(['jgs']),
  pk_th: new Set(['jgs']),
};

function MemberNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as MemberNodeData;
  const { member, onSelectMember } = nodeData;

  const { activeFocusNodeId, hoveredNodeId, isFinalPhase } = useActiveNode();

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [member.image]);

  const targetFocusId = hoveredNodeId || (activeFocusNodeId && !isFinalPhase ? activeFocusNodeId : null);

  const isActiveFocus = member.id === activeFocusNodeId && !isFinalPhase;
  const isHovered = member.id === hoveredNodeId;

  let isDimmed = false;
  if (targetFocusId) {
    const isConnected =
      member.id === targetFocusId ||
      Boolean(CONNECTIVITY_MAP[targetFocusId]?.has(member.id));
    isDimmed = !isConnected;
  }

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
      style={{ willChange: 'transform' }}
      className={`network-node-wrapper relative group cursor-pointer select-none ${
        isDimmed ? 'dimmed' : ''
      } ${isHovered || isActiveFocus ? 'highlighted z-50' : ''}`}
    >
      {/* GPU Accelerated Glow Layer for Active Focus */}
      <div
        className={`absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 blur-md pointer-events-none transition-opacity duration-200 ${
          isActiveFocus ? 'opacity-90' : 'opacity-0'
        }`}
      />

      {/* Main Node Container */}
      <div
        className={`relative flex flex-col items-center p-3.5 sm:p-4.5 rounded-2xl bg-[#09090b] border transition-transform duration-200 ease-out ${
          isActiveFocus
            ? 'scale-105 border-blue-400 ring-2 ring-blue-400 z-50'
            : 'group-hover:scale-102 group-hover:border-blue-400/80'
        } ${
          isMainLeader
            ? 'w-[205px] sm:w-[225px] border-blue-500/80'
            : 'w-[165px] sm:w-[180px] border-zinc-800'
        }`}
      >
        {/* Circular Profile Image or Fallback Avatar */}
        <div className="relative mb-2 shrink-0 flex items-center justify-center">
          {!imgError ? (
            <img
              src={member.image}
              alt={member.name}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              className={`rounded-full object-cover object-center transition-colors duration-200 ${
                isMainLeader
                  ? 'w-16 h-16 sm:w-18 sm:h-18 border-2 border-blue-400 group-hover:border-white'
                  : 'w-13 h-13 sm:w-15 sm:h-15 border-2 border-zinc-700 group-hover:border-blue-400'
              }`}
            />
          ) : (
            <div
              className={`rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center font-black text-white border-2 border-blue-400 ${
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
