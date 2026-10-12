'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface GlobeWireframeProps {
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  graticuleColor?: string;
  graticuleOpacity?: number;
  sphereOutlineColor?: string;
  sphereOutlineWidth?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  initialRotation?: [number, number];
  enableInteraction?: boolean;
  tilt?: number; // latitude tilt in degrees
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

// In-memory cache for decoded world-atlas arcs
let cachedArcs: [number, number][][] | null = null;
let fetchPromise: Promise<[number, number][][]> | null = null;

// Built-in simplified fallback continent outlines in case of network unavailability
const FALLBACK_CONTINENTS: [number, number][][] = [
  // Simplified Africa
  [[-17, 30], [-10, 36], [10, 37], [32, 31], [43, 12], [51, 11], [40, -10], [33, -28], [26, -34], [18, -34], [12, -18], [9, 4], [-5, 5], [-17, 15], [-17, 30]],
  // Simplified Eurasia
  [[-9, 36], [0, 43], [-5, 48], [5, 54], [10, 60], [28, 70], [60, 70], [100, 77], [170, 66], [140, 50], [130, 42], [120, 31], [105, 20], [80, 13], [70, 22], [50, 25], [36, 36], [26, 40], [14, 45], [-9, 36]],
  // Simplified North America
  [[-168, 66], [-140, 70], [-100, 70], [-65, 60], [-55, 48], [-75, 35], [-81, 25], [-97, 26], [-105, 20], [-90, 15], [-80, 8], [-105, 19], [-120, 34], [-125, 49], [-140, 60], [-168, 66]],
  // Simplified South America
  [[-80, 8], [-60, 10], [-35, -5], [-38, -13], [-42, -23], [-53, -33], [-65, -55], [-75, -50], [-73, -40], [-81, -5], [-80, 8]],
  // Simplified Australia
  [[114, -22], [124, -15], [136, -12], [142, -10], [153, -28], [150, -37], [138, -35], [115, -34], [114, -22]],
  // Simplified Antarctica
  [[-180, -78], [-120, -74], [-60, -65], [0, -70], [60, -68], [120, -66], [180, -78]],
];

// Pre-generated graticule lines
function generateGraticules(): [number, number][][] {
  const lines: [number, number][][] = [];
  // Parallels (latitudes)
  const latitudes = [-60, -40, -20, 0, 20, 40, 60, 80];
  for (const lat of latitudes) {
    const ring: [number, number][] = [];
    for (let lon = -180; lon <= 180; lon += 3) {
      ring.push([lon, lat]);
    }
    lines.push(ring);
  }
  // Meridians (longitudes)
  for (let lon = -180; lon < 180; lon += 30) {
    const meridian: [number, number][] = [];
    for (let lat = -85; lat <= 85; lat += 3) {
      meridian.push([lon, lat]);
    }
    lines.push(meridian);
  }
  return lines;
}

const GRATICULES = generateGraticules();

async function loadWorldArcs(): Promise<[number, number][][]> {
  if (cachedArcs) return cachedArcs;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const topo = await res.json();
      if (!topo.transform || !Array.isArray(topo.arcs)) {
        throw new Error('Invalid TopoJSON format');
      }

      const { scale: [sx, sy], translate: [tx, ty] } = topo.transform;
      const decoded: [number, number][][] = topo.arcs.map((arc: [number, number][]) => {
        let x = 0;
        let y = 0;
        return arc.map(([dx, dy]: [number, number]) => {
          x += dx;
          y += dy;
          return [x * sx + tx, y * sy + ty];
        });
      });

      cachedArcs = decoded;
      return decoded;
    } catch (err) {
      console.warn('GlobeWireframe: world-atlas CDN unavailable, using fallback continents.', err);
      cachedArcs = FALLBACK_CONTINENTS;
      return FALLBACK_CONTINENTS;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

export default function GlobeWireframe({
  className = '',
  strokeColor = 'rgba(255, 255, 255, 0.7)',
  strokeWidth = 0.85,
  graticuleColor = 'rgba(255, 255, 255, 0.1)',
  graticuleOpacity = 1.0,
  sphereOutlineColor = 'rgba(255, 255, 255, 0.35)',
  sphereOutlineWidth = 1.1,
  autoRotate = true,
  autoRotateSpeed = 0.28,
  initialRotation = [30, 20],
  enableInteraction = true,
  tilt = 20,
}: GlobeWireframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [worldArcs, setWorldArcs] = useState<[number, number][][]>(cachedArcs || FALLBACK_CONTINENTS);
  const [isVisible, setIsVisible] = useState(false);

  // Rotation state: [longitude, latitude]
  const rotationRef = useRef<[number, number]>([initialRotation[0], tilt]);
  const isDraggingRef = useRef(false);
  const lastPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  // Load world data
  useEffect(() => {
    let active = true;
    loadWorldArcs().then((arcs) => {
      if (active) setWorldArcs(arcs);
    });
    return () => {
      active = false;
    };
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion.current = mq.matches;
      const handler = (e: MediaQueryListEvent) => {
        prefersReducedMotion.current = e.matches;
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  // IntersectionObserver to pause when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Projection math
  const projectPoint = useCallback(
    (lon: number, lat: number, rotLon: number, rotLat: number): Point3D => {
      const rad = Math.PI / 180;
      const l = (lon - rotLon) * rad;
      const p = lat * rad;
      const p0 = rotLat * rad;

      const cosP = Math.cos(p);
      const sinP = Math.sin(p);
      const cosL = Math.cos(l);
      const sinL = Math.sin(l);
      const cosP0 = Math.cos(p0);
      const sinP0 = Math.sin(p0);

      const x = cosP * sinL;
      const y = cosP0 * sinP - sinP0 * cosP * cosL;
      const z = sinP0 * sinP + cosP0 * cosP * cosL;

      return { x, y, z };
    },
    []
  );

  // Clipping segment to horizon where z = 0
  const clipToHorizon = useCallback((pA: Point3D, pB: Point3D): Point3D => {
    const t = pA.z / (pA.z - pB.z);
    const xi = pA.x + t * (pB.x - pA.x);
    const yi = pA.y + t * (pB.y - pA.y);
    const len = Math.hypot(xi, yi) || 1;
    return { x: xi / len, y: yi / len, z: 0 };
  }, []);

  // Main render function
  const renderGlobe = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Half-Earth cropping: Sphere center is positioned near bottom edge so upper hemisphere rises into view
    // Responsive radius fits with comfortable lateral margins to prevent left/right edge clipping
    const radius = Math.min(width * 0.44, height * 0.88, 260);
    const cx = width / 2;
    // Position center slightly below bottom so approximately 50-60% of top hemisphere is visible
    const cy = height + radius * 0.08;

    const [rotLon, rotLat] = rotationRef.current;

    // 1. Subtle horizon atmospheric glow behind the sphere rim
    const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.05);
    glowGrad.addColorStop(0, 'rgba(56, 209, 255, 0)');
    glowGrad.addColorStop(0.85, 'rgba(56, 209, 255, 0.04)');
    glowGrad.addColorStop(0.97, 'rgba(255, 255, 255, 0.08)');
    glowGrad.addColorStop(1, 'rgba(56, 209, 255, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
    ctx.fill();

    // 2. Graticules (Latitude & Longitude grid lines)
    if (graticuleOpacity > 0) {
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = graticuleColor;
      ctx.beginPath();

      for (const line of GRATICULES) {
        let drawing = false;
        let lastPt: Point3D | null = null;

        for (let i = 0; i < line.length; i++) {
          const pt = projectPoint(line[i][0], line[i][1], rotLon, rotLat);

          if (pt.z >= 0) {
            if (!drawing) {
              if (lastPt && lastPt.z < 0) {
                const clipped = clipToHorizon(lastPt, pt);
                ctx.moveTo(cx + clipped.x * radius, cy - clipped.y * radius);
              } else {
                ctx.moveTo(cx + pt.x * radius, cy - pt.y * radius);
              }
              drawing = true;
            }
            ctx.lineTo(cx + pt.x * radius, cy - pt.y * radius);
          } else {
            if (drawing && lastPt && lastPt.z >= 0) {
              const clipped = clipToHorizon(lastPt, pt);
              ctx.lineTo(cx + clipped.x * radius, cy - clipped.y * radius);
            }
            drawing = false;
          }
          lastPt = pt;
        }
      }
      ctx.stroke();
    }

    // 3. Country Outlines
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();

    for (const arc of worldArcs) {
      if (arc.length < 2) continue;
      let drawing = false;
      let lastPt: Point3D | null = null;

      for (let i = 0; i < arc.length; i++) {
        const pt = projectPoint(arc[i][0], arc[i][1], rotLon, rotLat);

        if (pt.z >= 0) {
          if (!drawing) {
            if (lastPt && lastPt.z < 0) {
              const clipped = clipToHorizon(lastPt, pt);
              ctx.moveTo(cx + clipped.x * radius, cy - clipped.y * radius);
            } else {
              ctx.moveTo(cx + pt.x * radius, cy - pt.y * radius);
            }
            drawing = true;
          }
          ctx.lineTo(cx + pt.x * radius, cy - pt.y * radius);
        } else {
          if (drawing && lastPt && lastPt.z >= 0) {
            const clipped = clipToHorizon(lastPt, pt);
            ctx.lineTo(cx + clipped.x * radius, cy - clipped.y * radius);
          }
          drawing = false;
        }
        lastPt = pt;
      }
    }
    ctx.stroke();

    // 4. Outer Sphere Horizon Outline (Crisp, thin white circular rim)
    ctx.lineWidth = sphereOutlineWidth;
    ctx.strokeStyle = sphereOutlineColor;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }, [worldArcs, strokeColor, strokeWidth, graticuleColor, graticuleOpacity, sphereOutlineColor, sphereOutlineWidth, projectPoint, clipToHorizon]);

  // Animation Loop
  useEffect(() => {
    if (!isVisible) {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      return;
    }

    // Single render if reduced motion
    if (prefersReducedMotion.current) {
      renderGlobe();
      return;
    }

    const tick = () => {
      if (autoRotate && !isDraggingRef.current) {
        rotationRef.current[0] = (rotationRef.current[0] + autoRotateSpeed) % 360;
      }
      renderGlobe();
      animFrameId.current = requestAnimationFrame(tick);
    };

    animFrameId.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible, autoRotate, autoRotateSpeed, renderGlobe]);

  // Pointer interaction handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!enableInteraction) return;
    isDraggingRef.current = true;
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !enableInteraction) return;
    const dx = e.clientX - lastPointerPos.current.x;
    const dy = e.clientY - lastPointerPos.current.y;
    lastPointerPos.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.35;
    const currentRot = rotationRef.current;
    const nextLon = (currentRot[0] + dx * sensitivity) % 360;
    // Clamp latitude tilt between -75 and +75
    const nextLat = Math.max(-75, Math.min(75, currentRot[1] - dy * sensitivity));

    rotationRef.current = [nextLon, nextLat];

    if (prefersReducedMotion.current) {
      renderGlobe();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!enableInteraction) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore if not captured
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{
        touchAction: enableInteraction ? 'none' : 'auto',
        maskImage:
          'linear-gradient(to bottom, black 0%, black 68%, rgba(0, 0, 0, 0.4) 86%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, black 0%, black 68%, rgba(0, 0, 0, 0.4) 86%, transparent 100%)',
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full h-full block ${enableInteraction ? 'cursor-grab active:cursor-grabbing' : ''}`}
        aria-label="Monochrome interactive 3D wireframe Earth globe"
        role="img"
      />
    </div>
  );
}
