'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
  Background,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import CoreNodeComponent from './CoreNode';
import MemberNodeComponent from './MemberNode';
import DataFlowEdgeComponent from './DataFlowEdge';
import ProfileModal from './ProfileModal';
import LeftDataPanel from './LeftDataPanel';
import { NETWORK_DATA, Member } from './networkData';
import './network.css';

gsap.registerPlugin(ScrollTrigger);

const nodeTypes = {
  coreNode: CoreNodeComponent,
  memberNode: MemberNodeComponent,
};

const edgeTypes = {
  dataFlow: DataFlowEdgeComponent,
};

function NetworkFlowContent() {
  const { setViewport } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeFocusNodeId, setActiveFocusNodeId] = useState<string>('hod');
  const [isFinalPhase, setIsFinalPhase] = useState<boolean>(false);
  const [isTitleVisible, setIsTitleVisible] = useState<boolean>(false);

  const lastActiveIdRef = useRef<string>('hod');

  // Prevent redundant React re-renders during high-frequency scroll ticks
  const updateFocusId = useCallback((id: string) => {
    if (lastActiveIdRef.current !== id) {
      lastActiveIdRef.current = id;
      setActiveFocusNodeId(id);
    }
  }, []);

  // Member select handler
  const handleSelectMember = useCallback((member: Member) => {
    setSelectedMember(member);
  }, []);

  // Map of all members by ID for easy lookup
  const allMembersMap = useMemo(() => {
    const map = new Map<string, Member>();
    NETWORK_DATA.leadership.forEach((m) => map.set(m.id, m));
    NETWORK_DATA.heads.forEach((m) => map.set(m.id, m));
    return map;
  }, []);

  // Currently active focus member object for Left Data Panel
  const activeFocusMember = useMemo(() => {
    if (allMembersMap.has(activeFocusNodeId)) {
      return allMembersMap.get(activeFocusNodeId)!;
    }
    return NETWORK_DATA.leadership[0]; // Default to HOD
  }, [activeFocusNodeId, allMembersMap]);

  // Build static node data with generous vertical gap & balanced wings
  const initialNodes: Node[] = useMemo(() => {
    const nodesList: Node[] = [];

    // 1. Core Root Node: aIDEAS (Top of Center Column)
    nodesList.push({
      id: 'aideas',
      type: 'coreNode',
      position: { x: 132.5, y: 0 },
      data: {
        name: NETWORK_DATA.core.name,
        role: NETWORK_DATA.core.role,
      },
    });

    // 2. Executive Leadership Nodes (Coordinators & GS/JGS placed side-by-side as parallel equals)
    const leadershipPosMap: { [key: string]: { x: number; y: number } } = {
      hod: { x: 200, y: 220 },
      coordinator: { x: -80, y: 440 },   // Faculty Coordinator 1 - Parallel Left
      coordinator2: { x: 480, y: 440 },  // Faculty Coordinator 2 - Parallel Right
      gs: { x: -80, y: 680 },   // General Secretary - Parallel Left
      jgs: { x: 480, y: 680 },  // Joint General Secretary - Parallel Right
    };

    NETWORK_DATA.leadership.forEach((item) => {
      const pos = leadershipPosMap[item.id] || { x: 200, y: 680 };
      nodesList.push({
        id: item.id,
        type: 'memberNode',
        position: pos,
        data: {
          member: item,
          isLeadership: true,
          onSelectMember: handleSelectMember,
        },
      });
    });

    // 3. Department & Team Heads - Balanced wings around GS & JGS (max y: 960)
    const headsLayout: { [key: string]: { x: number; y: number } } = {
      // Left Wing (GS sub-tree: 6 Heads)
      nishi_treasurer: { x: -440, y: 520 },
      arnav_media: { x: -640, y: 660 },
      atharva_media: { x: -640, y: 820 },
      manish_marketing: { x: -440, y: 960 },
      sanket_desig: { x: -220, y: 940 },
      kinjal_desig: { x: -40, y: 920 },

      // Bottom Center & Right Wing (JGS sub-tree: 7 Heads)
      pranshu_em: { x: 200, y: 920 },
      anvi_event: { x: 440, y: 920 },
      kush_marketing: { x: 620, y: 940 },
      priti_edito: { x: 840, y: 960 },
      pk_th: { x: 1040, y: 820 },
      divesh_th: { x: 1040, y: 660 },
      aa_th: { x: 840, y: 520 },
    };

    NETWORK_DATA.heads.forEach((item, index) => {
      const pos = headsLayout[item.id] || { x: (index % 2 === 0 ? -220 : 620), y: 800 };
      nodesList.push({
        id: item.id,
        type: 'memberNode',
        position: pos,
        data: {
          member: item,
          isLeadership: false,
          idleDelayIndex: index,
          onSelectMember: handleSelectMember,
        },
      });
    });

    return nodesList;
  }, [handleSelectMember]);

  // Build connection edges for both Left and Right wings
  const initialEdges: Edge[] = useMemo(() => {
    const edgesList: Edge[] = [];

    // Executive Leadership branching (aIDEAS -> HOD -> Parallel Coordinators -> GS & JGS)
    edgesList.push(
      { id: 'e-aideas-hod', type: 'dataFlow', source: 'aideas', target: 'hod', sourceHandle: 'bottom', targetHandle: 'target-top' },
      { id: 'e-hod-coord', type: 'dataFlow', source: 'hod', target: 'coordinator', sourceHandle: 'source-bottom', targetHandle: 'target-top' },
      { id: 'e-hod-coord2', type: 'dataFlow', source: 'hod', target: 'coordinator2', sourceHandle: 'source-bottom', targetHandle: 'target-top' },
      { id: 'e-coord-gs', type: 'dataFlow', source: 'coordinator', target: 'gs', sourceHandle: 'source-bottom', targetHandle: 'target-top' },
      { id: 'e-coord2-jgs', type: 'dataFlow', source: 'coordinator2', target: 'jgs', sourceHandle: 'source-bottom', targetHandle: 'target-top' }
    );

    // Oval constellation connections: GS connects to Left Wing, JGS connects to Right Wing
    NETWORK_DATA.heads.forEach((head) => {
      const isLeft =
        head.id.includes('nishi') ||
        head.id.includes('arnav') ||
        head.id.includes('atharva') ||
        head.id.includes('manish') ||
        head.id.includes('sanket') ||
        head.id.includes('kinjal');

      const parentExecutiveId = isLeft ? 'gs' : 'jgs';

      edgesList.push({
        id: `e-${parentExecutiveId}-${head.id}`,
        type: 'dataFlow',
        source: parentExecutiveId,
        target: head.id,
        sourceHandle: isLeft ? 'source-left' : 'source-right',
        targetHandle: isLeft ? 'target-right' : 'target-left',
      });
    });

    return edgesList;
  }, []);

  const [nodes] = useState<Node[]>(initialNodes);
  const [edges] = useState<Edge[]>(initialEdges);

  // List of all graph nodes in storytelling tour order matching exact initialNodes coordinates
  const TOUR_NODES = useMemo(
    () => [
      // 1. Executive Leadership Chain (HOD -> Parallel Coordinators -> GS & JGS Parallel Equals)
      { id: 'hod', x: 200, y: 220 },
      { id: 'coordinator', x: -80, y: 440 },
      { id: 'coordinator2', x: 480, y: 440 },
      { id: 'gs', x: -80, y: 680 },
      { id: 'jgs', x: 480, y: 680 },

      // 2. Left Wing Tour
      { id: 'nishi_treasurer', x: -440, y: 520 },
      { id: 'arnav_media', x: -640, y: 660 },
      { id: 'atharva_media', x: -640, y: 820 },
      { id: 'manish_marketing', x: -440, y: 960 },
      { id: 'sanket_desig', x: -220, y: 940 },
      { id: 'kinjal_desig', x: -40, y: 920 },

      // 3. Bottom Center & Right Wing Tour
      { id: 'pranshu_em', x: 200, y: 920 },
      { id: 'anvi_event', x: 440, y: 920 },
      { id: 'kush_marketing', x: 620, y: 940 },
      { id: 'priti_edito', x: 840, y: 960 },
      { id: 'aa_th', x: 840, y: 520 },
      { id: 'divesh_th', x: 1040, y: 660 },
      { id: 'pk_th', x: 1040, y: 820 },
    ],
    []
  );

  const targetCamRef = useRef<{ x: number; y: number; zoom: number }>({ x: 200, y: 0, zoom: 0.82 });
  const currentCamRef = useRef<{ x: number; y: number; zoom: number }>({ x: 200, y: 0, zoom: 0.82 });

  // Native 60-120fps RAF LERP Physics Engine for buttery-smooth camera movement
  useEffect(() => {
    let animationFrameId: number;

    const lerpLoop = () => {
      const target = targetCamRef.current;
      const current = currentCamRef.current;

      // 0.08 Lerp Factor gives ultra-smooth, luxury momentum physics
      const factor = 0.08;
      current.x += (target.x - current.x) * factor;
      current.y += (target.y - current.y) * factor;
      current.zoom += (target.zoom - current.zoom) * factor;

      const delta = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) + Math.abs(target.zoom - current.zoom);
      if (delta > 0.005) {
        setViewport({ x: current.x, y: current.y, zoom: current.zoom }, { duration: 0 });
      }

      animationFrameId = requestAnimationFrame(lerpLoop);
    };

    animationFrameId = requestAnimationFrame(lerpLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [setViewport]);

  // GSAP ScrollTrigger + Lenis smooth momentum scroll binding
  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    // Initialize Lenis smooth scroll engine
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Helper to calculate camera viewport center target
    const setCam = (targetNodeX: number, targetNodeY: number, zoomVal: number, overrideTargetScreenX?: number) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isDesktop = viewportWidth >= 1024;
      const isMobile = viewportWidth < 640;

      // On desktop during tour, align to right workspace center (viewportWidth + 490) / 2.
      // In overview phase or on mobile, center horizontally (viewportWidth / 2)!
      const targetScreenX = overrideTargetScreenX !== undefined
        ? overrideTargetScreenX
        : (isDesktop && !isFinalPhase)
        ? (viewportWidth + 490) / 2
        : viewportWidth / 2;

      const targetScreenY = isMobile
        ? (!isFinalPhase ? viewportHeight * 0.36 : viewportHeight * 0.5)
        : viewportHeight / 2;

      // Exact React Flow canvas top-left offset formula:
      const x = targetScreenX - targetNodeX * zoomVal;
      const y = targetScreenY - targetNodeY * zoomVal;

      targetCamRef.current = { x, y, zoom: zoomVal };
    };

    // GSAP ScrollTrigger timeline with Lerp engine integration
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        const isMobile = window.innerWidth < 640;
        const closeZoom = isMobile ? 0.45 : 0.82;
        const fullZoom = isMobile ? 0.11 : 0.38;

        // Phase 1: Guided Close-Up Storytelling Tour (0.00 to 0.85 progress)
        if (p < 0.85) {
          setIsFinalPhase((prev) => (prev ? false : prev));
          setIsTitleVisible((prev) => (prev ? false : prev));

          const tourProgress = (p / 0.85) * (TOUR_NODES.length - 1);
          const currIdx = Math.floor(tourProgress);
          const nextIdx = Math.min(TOUR_NODES.length - 1, currIdx + 1);
          const frac = tourProgress - currIdx;

          // Smooth cosine easing curve for keyframe transitions
          const smoothFrac = 0.5 - 0.5 * Math.cos(frac * Math.PI);

          const currNode = TOUR_NODES[currIdx];
          const nextNode = TOUR_NODES[nextIdx] || currNode;

          const rawTargetX = currNode.x + (nextNode.x - currNode.x) * smoothFrac;
          const targetY = currNode.y + (nextNode.y - currNode.y) * smoothFrac;

          // On mobile, center exact target node X so active node is dead-center on screen!
          // On desktop, use steady 0.45 horizontal dampening for smooth camera flow.
          const targetX = isMobile ? rawTargetX : (200 + (rawTargetX - 200) * 0.45);

          const activeId = frac > 0.5 ? nextNode.id : currNode.id;
          updateFocusId(activeId);
          setCam(targetX, targetY, closeZoom);
        }
        // Phase 2: Final Reveal - Zoom Out to Full Network Overview (0.85 to 1.00 progress)
        else {
          setIsFinalPhase((prev) => (!prev ? true : prev));
          const wantTitle = p >= 0.90;
          setIsTitleVisible((prev) => (prev !== wantTitle ? wantTitle : prev));

          const finalProgress = (p - 0.85) / 0.15;
          const smoothFinal = 0.5 - 0.5 * Math.cos(finalProgress * Math.PI);

          const lastNode = TOUR_NODES[TOUR_NODES.length - 1];
          const lastDampenedX = isMobile ? lastNode.x : (200 + (lastNode.x - 200) * 0.45);

          const viewportWidth = window.innerWidth;
          const rightCenter = (viewportWidth + 490) / 2;
          const screenCenter = viewportWidth / 2;

          // Smoothly glide target screen center from right workspace to exact dead center of viewport
          const targetScreenX = rightCenter - (rightCenter - screenCenter) * smoothFinal;

          // Smoothly glide camera target from last position to tree's geometric center
          const overviewTargetY = isMobile ? 480 : 150;
          const targetX = lastDampenedX + (200 - lastDampenedX) * smoothFinal;
          const targetY = lastNode.y + (overviewTargetY - lastNode.y) * smoothFinal;
          const zoomVal = closeZoom - (closeZoom - fullZoom) * smoothFinal;

          updateFocusId('');
          setCam(targetX, targetY, zoomVal, targetScreenX);
        }
      },
    });

    return () => {
      st.kill();
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, [setViewport, updateFocusId, TOUR_NODES, isFinalPhase]);

  // Handle Hover state on node for dimming unrelated nodes
  const onNodeMouseEnter = (_: React.MouseEvent, node: Node) => {
    setHoveredNodeId(node.id);
    if (allMembersMap.has(node.id)) {
      setActiveFocusNodeId(node.id);
    }
  };

  const onNodeMouseLeave = () => {
    setHoveredNodeId(null);
  };

  // Update nodes & edges display state based on activeFocusNodeId and hoveredNodeId
  const displayNodes = useMemo(() => {
    return nodes.map((node) => {
      const isFocused = node.id === activeFocusNodeId;
      const isHovered = node.id === hoveredNodeId;

      let isDimmed = false;
      if (hoveredNodeId) {
        const isConnected =
          node.id === hoveredNodeId ||
          edges.some(
            (e) =>
              (e.source === hoveredNodeId && e.target === node.id) ||
              (e.target === hoveredNodeId && e.source === node.id)
          );
        isDimmed = !isConnected;
      } else if (isFinalPhase) {
        isDimmed = false; // In final reveal, all cards light up together!
      } else {
        // Dim all non-focused background cards during scroll tour so focused card pops out!
        isDimmed = !isFocused;
      }

      return {
        ...node,
        data: {
          ...node.data,
          isActiveFocus: isFocused,
          isHovered,
          isDimmed,
        },
      };
    });
  }, [nodes, edges, activeFocusNodeId, hoveredNodeId, isFinalPhase]);

  const displayEdges = useMemo(() => {
    const focusId = hoveredNodeId || activeFocusNodeId;
    if (!focusId || isFinalPhase) return edges;

    return edges.map((e) => {
      const isConnected = e.source === focusId || e.target === focusId;
      return {
        ...e,
        className: isConnected ? 'highlighted' : 'dimmed',
      };
    });
  }, [edges, hoveredNodeId, activeFocusNodeId, isFinalPhase]);

  // Determine stage step number for Left Data Panel
  const stageStep = useMemo(() => {
    if (activeFocusNodeId === 'hod') return 1;
    if (activeFocusNodeId === 'coordinator' || activeFocusNodeId === 'coordinator2') return 2;
    if (activeFocusNodeId === 'gs') return 3;
    if (activeFocusNodeId === 'jgs') return 4;
    return 5;
  }, [activeFocusNodeId]);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-[#050505]">
      {/* Sticky Fullscreen Viewport */}
      <div ref={stickyRef} className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between z-10 bg-black">
        
        {/* Background Image Layer (Abstract Flowing Light Ombre Gradient - Full Brightness) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <img
            src="/network_bg.jpeg"
            alt="Network Background"
            className="w-full h-full object-cover object-center opacity-100 scale-100"
          />
          <div className="absolute inset-0 bg-black/15" />
        </div>

        {/* Compact Header Bar Overlay */}
        <div className="absolute top-14 left-0 right-0 z-30 flex flex-wrap items-center justify-end gap-4 px-6 sm:px-12 pointer-events-none">
          <div className="hidden sm:block text-xs font-mono text-zinc-300 bg-black/80 px-4 py-1.5 rounded-full border border-zinc-800 pointer-events-auto">
            Scroll to Travel Through Graph →
          </div>
        </div>

        {/* Main Viewport Container */}
        <div className="relative w-full h-full">
          
          {/* Fullscreen Interactive React Flow Graph Canvas (Base Layer z-0) */}
          <div className="absolute inset-0 w-full h-full z-0">
            <ReactFlow
              nodes={displayNodes}
              edges={displayEdges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              zoomOnScroll={false}
              panOnScroll={false}
              zoomOnDoubleClick={false}
              preventScrolling={false}
              minZoom={0.1}
              maxZoom={1.5}
              onlyRenderVisibleElements={true}
              fitViewOptions={{ padding: 0.1 }}
              className="w-full h-full"
            >
              <Background color="#3b82f6" gap={36} size={1} style={{ opacity: 0.08 }} />
              <Controls showInteractive={false} className="!bg-black !border-zinc-800 !fill-blue-400 hidden sm:block" />
            </ReactFlow>
          </div>

          {/* Floating Left/Bottom Data Panel: Active Focused Member Story & Experience Data */}
          <div className={`absolute bottom-14 sm:bottom-auto sm:top-28 left-3 right-3 sm:left-8 sm:right-auto lg:left-10 z-40 transition-all duration-500 ${isFinalPhase ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
            <LeftDataPanel
              stageName={activeFocusMember.role}
              stageStep={stageStep}
              totalSteps={5}
              activeMember={activeFocusMember}
              onOpenModal={(m) => setSelectedMember(m)}
            />
          </div>

          {/* Grand Standalone Header Banner: WE ARE TEAM aIDEAS (Only appears when scroll reaches 92%+) */}
          <div
            className={`absolute top-24 sm:top-24 left-0 right-0 z-30 flex flex-col items-center justify-center transition-all duration-700 ease-out pointer-events-none ${
              isTitleVisible
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-90 -translate-y-6'
            }`}
          >
            <h1 className="text-xl sm:text-5xl lg:text-6xl font-black font-[family-name:var(--font-orbitron)] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-purple-400 tracking-wider drop-shadow-[0_0_45px_rgba(59,130,246,0.95)] text-center uppercase px-4 leading-none">
              WE ARE TEAM aIDEAS
            </h1>

            <p className="text-[8px] sm:text-xs font-semibold font-[family-name:var(--font-orbitron)] text-zinc-300 mt-1.5 sm:mt-2 tracking-[0.25em] uppercase text-center drop-shadow-lg opacity-90">
              Artificial Intelligence & Data Science Student Association
            </p>
          </div>

        </div>
      </div>

      {/* Member Profile Modal on Node Click */}
      <ProfileModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}

export default function AideasNetwork() {
  return (
    <ReactFlowProvider>
      <NetworkFlowContent />
    </ReactFlowProvider>
  );
}
