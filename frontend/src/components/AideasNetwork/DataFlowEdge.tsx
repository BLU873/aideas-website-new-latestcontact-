'use client';

import React, { memo } from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';

function DataFlowEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const pathId = `edge-path-${id}`;

  return (
    <>
      {/* Base Dotted Connecting Path */}
      <path
        id={pathId}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
      />

      {/* Streaming Data Particle 1 */}
      <g className="pointer-events-none">
        <circle r="3.5" fill="#60a5fa" opacity="0.9">
          <animateMotion
            dur="2.5s"
            repeatCount="indefinite"
            rotate="auto"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      </g>

      {/* Streaming Data Particle 2 (Staggered Offset) */}
      <g className="pointer-events-none">
        <circle r="2.5" fill="#93c5fd" opacity="0.7">
          <animateMotion
            dur="2.5s"
            begin="1.25s"
            repeatCount="indefinite"
            rotate="auto"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      </g>
    </>
  );
}

export default memo(DataFlowEdgeComponent);
