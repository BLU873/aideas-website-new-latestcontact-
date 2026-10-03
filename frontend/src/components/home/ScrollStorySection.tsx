'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useScroll } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const TOTAL_FRAMES = 180;
const MAX_CACHE_DESKTOP = 36;
const MAX_CACHE_MOBILE = 24;
const MAX_CONCURRENT_REQUESTS = 4;

interface StoryBeat {
  id: string;
  step: string;
  eyebrow: string;
  headline: string;
  supporting: string;
  accent: string;
  startProgress: number;
  peakStart: number;
  peakEnd: number;
  endProgress: number;
}

const STORY_BEATS: StoryBeat[] = [
  {
    id: 'intro',
    step: '01',
    eyebrow: 'A CLOSER LOOK',
    headline: 'Ideas start somewhere.',
    supporting:
      'aiDEAS is a student-led community where curiosity turns into engineering — bridging the gap between theoretical concepts and real implementation.',
    accent: '#38bdf8',
    startProgress: 0.0,
    peakStart: 0.03,
    peakEnd: 0.18,
    endProgress: 0.24,
  },
  {
    id: 'build',
    step: '02',
    eyebrow: 'PROJECT-FIRST CULTURE',
    headline: 'Learn by building.',
    supporting:
      'Turn classroom concepts into working projects, technical workshops, and hackathon prototypes through hands-on problem solving.',
    accent: '#60a5fa',
    startProgress: 0.26,
    peakStart: 0.30,
    peakEnd: 0.44,
    endProgress: 0.49,
  },
  {
    id: 'collaborate',
    step: '03',
    eyebrow: 'OPEN COLLABORATION',
    headline: 'Build together.',
    supporting:
      'Learn alongside peers, review code, and exchange architectures in an open ecosystem spanning all branches and academic years.',
    accent: '#818cf8',
    startProgress: 0.51,
    peakStart: 0.55,
    peakEnd: 0.69,
    endProgress: 0.74,
  },
  {
    id: 'impact',
    step: '04',
    eyebrow: 'REAL-WORLD IMPACT',
    headline: 'Make something real.',
    supporting:
      'Build solutions that extend far beyond the semester — empowering every student to become AI-capable, AI-empowered, and future-ready.',
    accent: '#b06bff',
    startProgress: 0.76,
    peakStart: 0.80,
    peakEnd: 1.0, // Stays visible until the sticky viewport releases naturally into Footer
    endProgress: 1.0,
  },
];

const getFrameUrl = (frameIndex: number): string => {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIndex)));
  const pad = String(clamped).padStart(3, '0');
  return `/assets/scroll-story/aideas/${pad}.jpg`;
};

export default function ScrollStorySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stickyViewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // References for memory and draw tracking
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const inFlightRef = useRef<Set<number>>(new Set());
  const queueRef = useRef<number[]>([]);
  const activeRequestsRef = useRef(0);
  const lastDrawnFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const scrollDirectionRef = useRef<'forward' | 'backward' | 'none'>('forward');
  const lastProgressRef = useRef(0);
  const isDestroyedRef = useRef(false);
  const isSectionNearRef = useRef(false);
  const brandLogoRef = useRef<HTMLImageElement | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Framer-motion scroll progress linked to the parent scroll-story section
  // Offset start start -> end end: exactly 0.0 at pinning moment, 1.0 at release moment
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  });

  // Canvas draw logic: high-quality direct buffer drawing preserving full source resolution
  const drawFrameToCanvas = useCallback((img: HTMLImageElement, frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Viewport display dimensions
    const rect = canvas.getBoundingClientRect();
    const cssWidth = rect.width > 0 ? rect.width : window.innerWidth;
    const cssHeight = rect.height > 0 ? rect.height : window.innerHeight;

    // Device Pixel Ratio with safe cap (desktop up to 2.0, mobile up to 2.0)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasW = Math.max(1, Math.round(cssWidth * dpr));
    const canvasH = Math.max(1, Math.round(cssHeight * dpr));

    // Ensure backing store matches physical display pixels
    if (canvas.width !== canvasW || canvas.height !== canvasH) {
      canvas.width = canvasW;
      canvas.height = canvasH;
    }

    // Source frame natural dimensions
    const imgW = img.naturalWidth || 1920;
    const imgH = img.naturalHeight || 1080;

    // Aspect ratios (source vs canvas)
    const sourceRatio = imgW / imgH; // 16:9 = 1.7777777777777777
    const canvasRatio = canvasW / canvasH;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    if (canvasRatio >= 1.2) {
      // Desktop / Landscape: Compare canvas aspect ratio vs source aspect ratio
      // Preserves 16:9 artwork without distortion, filling the viewport edge-to-edge
      const scale = canvasRatio > sourceRatio ? canvasW / imgW : canvasH / imgH;
      drawW = Math.round(imgW * scale);
      drawH = Math.round(imgH * scale);
      drawX = Math.round((canvasW - drawW) / 2);
      drawY = Math.round((canvasH - drawH) / 2);
    } else {
      // Mobile / Portrait: Scale to keep central ring and hands prominent without shrinking
      // Preserves 16:9 aspect ratio and centers hands in the upper-mid region (~38% from top)
      const scale = Math.max(canvasW / imgW, (canvasH * 0.48) / imgH);
      drawW = Math.round(imgW * scale);
      drawH = Math.round(imgH * scale);
      drawX = Math.round((canvasW - drawW) / 2);
      drawY = Math.round(canvasH * 0.38 - drawH / 2);
    }

    // High-quality canvas scaling configuration
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) {
      ctx.imageSmoothingQuality = 'high';
    }

    // Deep background base matching frame perimeter
    ctx.fillStyle = '#03070d';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Draw directly from decoded source image to destination canvas buffer
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Mask the Gemini watermark with the authentic aiDEAS logo
    const maskX = Math.round(drawX + (1732.5 / imgW) * drawW);
    const maskY = Math.round(drawY + (888.5 / imgH) * drawH);
    const maskRadius = Math.round(48 * (drawW / imgW));
    const maskDiameter = maskRadius * 2;

    // Dark circular base with feathered outer edge to cleanly erase the Gemini star without harsh edges
    ctx.save();
    const grad = ctx.createRadialGradient(
      maskX,
      maskY,
      maskRadius * 0.88,
      maskX,
      maskY,
      maskRadius * 1.12
    );
    grad.addColorStop(0, '#03070d');
    grad.addColorStop(0.85, '#03070d');
    grad.addColorStop(1, 'rgba(3, 7, 13, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(maskX, maskY, maskRadius * 1.12, 0, Math.PI * 2);
    ctx.fill();

    // Draw the authentic aiDEAS logo directly over the watermark
    const brandLogo = brandLogoRef.current;
    if (brandLogo && brandLogo.complete && brandLogo.naturalWidth > 0) {
      ctx.drawImage(
        brandLogo,
        maskX - maskRadius,
        maskY - maskRadius,
        maskDiameter,
        maskDiameter
      );
    }
    ctx.restore();

    lastDrawnFrameRef.current = frameNum;
  }, []);

  // Request & process frames with bounded memory cache
  const processQueue = useCallback(() => {
    if (isDestroyedRef.current) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxCache = isMobile ? MAX_CACHE_MOBILE : MAX_CACHE_DESKTOP;

    // Eviction if cache exceeds threshold
    if (cacheRef.current.size > maxCache) {
      const currentTarget = targetFrameRef.current;
      const sortedKeys = Array.from(cacheRef.current.keys()).sort((a, b) => {
        // Keep frame 1 pinned as initial anchor
        if (a === 1) return -1;
        if (b === 1) return 1;
        return Math.abs(b - currentTarget) - Math.abs(a - currentTarget);
      });

      while (cacheRef.current.size > maxCache && sortedKeys.length > 0) {
        const evictKey = sortedKeys.shift();
        if (evictKey !== undefined && evictKey !== 1 && evictKey !== lastDrawnFrameRef.current) {
          const evictedImg = cacheRef.current.get(evictKey);
          if (evictedImg) {
            evictedImg.onload = null;
            evictedImg.onerror = null;
            evictedImg.src = ''; // Release GPU texture memory cleanly
          }
          cacheRef.current.delete(evictKey);
        }
      }
    }

    // Process in-flight loading with concurrency limiter
    while (
      queueRef.current.length > 0 &&
      activeRequestsRef.current < MAX_CONCURRENT_REQUESTS
    ) {
      const nextIndex = queueRef.current.shift();
      if (!nextIndex || cacheRef.current.has(nextIndex) || inFlightRef.current.has(nextIndex)) {
        continue;
      }

      inFlightRef.current.add(nextIndex);
      activeRequestsRef.current++;

      const img = new Image();
      img.src = getFrameUrl(nextIndex);

      const onLoad = () => {
        inFlightRef.current.delete(nextIndex);
        activeRequestsRef.current--;
        if (isDestroyedRef.current) return;

        cacheRef.current.set(nextIndex, img);

        // If this loaded frame is the current target, or closer than what's currently drawn, render immediately
        const currentTarget = targetFrameRef.current;
        const currentDrawn = lastDrawnFrameRef.current;

        if (
          nextIndex === currentTarget ||
          Math.abs(nextIndex - currentTarget) < Math.abs(currentDrawn - currentTarget)
        ) {
          drawFrameToCanvas(img, nextIndex);
        }

        processQueue();
      };

      const onError = () => {
        inFlightRef.current.delete(nextIndex);
        activeRequestsRef.current--;
        processQueue();
      };

      img.onload = onLoad;
      img.onerror = onError;
      if (typeof img.decode === 'function') {
        img.decode().then(onLoad).catch(() => {
          // onload handler will catch it if decode rejects
        });
      }
    }
  }, [drawFrameToCanvas]);

  // Request a specific frame with directional priority preloading
  const requestFrame = useCallback(
    (target: number, direction: 'forward' | 'backward' | 'none') => {
      targetFrameRef.current = target;

      // 1. If target is already decoded, render immediately
      const cachedTarget = cacheRef.current.get(target);
      if (cachedTarget) {
        drawFrameToCanvas(cachedTarget, target);
      } else {
        // Find nearest available cached frame to ensure zero blank flashes
        let nearestFrame = lastDrawnFrameRef.current;
        let minDiff = Infinity;
        for (const key of cacheRef.current.keys()) {
          const diff = Math.abs(key - target);
          if (diff < minDiff) {
            minDiff = diff;
            nearestFrame = key;
          }
        }
        const fallbackImg = cacheRef.current.get(nearestFrame);
        if (fallbackImg) {
          drawFrameToCanvas(fallbackImg, nearestFrame);
        }
      }

      // 2. Build directional preload candidates around target
      const priorityList: number[] = [target];
      const forwardWindow = direction === 'backward' ? 6 : 14;
      const backwardWindow = direction === 'forward' ? 5 : 12;

      for (let i = 1; i <= Math.max(forwardWindow, backwardWindow); i++) {
        if (direction === 'backward') {
          if (i <= forwardWindow && target - i >= 1) priorityList.push(target - i);
          if (i <= backwardWindow && target + i <= TOTAL_FRAMES) priorityList.push(target + i);
        } else {
          if (i <= forwardWindow && target + i <= TOTAL_FRAMES) priorityList.push(target + i);
          if (i <= backwardWindow && target - i >= 1) priorityList.push(target - i);
        }
      }

      // Re-order queue prioritizing nearest frames to current target
      const unqueued = priorityList.filter(
        (f) => !cacheRef.current.has(f) && !inFlightRef.current.has(f) && !queueRef.current.includes(f)
      );

      queueRef.current = [...unqueued, ...queueRef.current.filter((f) => Math.abs(f - target) <= 25)];
      processQueue();
    },
    [drawFrameToCanvas, processQueue]
  );

  // Initial Load: Frame 1 immediately on mount
  useEffect(() => {
    isDestroyedRef.current = false;
    const initialImg = new Image();
    initialImg.src = getFrameUrl(1);

    const onInitialLoad = () => {
      if (isDestroyedRef.current) return;
      cacheRef.current.set(1, initialImg);
      requestAnimationFrame(() => {
        drawFrameToCanvas(initialImg, 1);
      });
      // Preload subsequent frames 2, 3, 4, 5
      for (let f = 2; f <= 6; f++) {
        queueRef.current.push(f);
      }
      processQueue();
    };

    // Preload authentic aiDEAS logo for watermark masking
    const brandLogo = new Image();
    brandLogo.src = '/assets/img/logo-icon.png';
    const onBrandLoad = () => {
      brandLogoRef.current = brandLogo;
      const currentDrawn = lastDrawnFrameRef.current;
      const currentImg = cacheRef.current.get(currentDrawn) || cacheRef.current.get(1);
      if (currentImg) {
        drawFrameToCanvas(currentImg, currentDrawn);
      }
    };
    brandLogo.onload = onBrandLoad;
    if (brandLogo.complete && brandLogo.naturalWidth > 0) {
      brandLogoRef.current = brandLogo;
    } else if (typeof brandLogo.decode === 'function') {
      brandLogo.decode().then(onBrandLoad).catch(onBrandLoad);
    }

    initialImg.onload = onInitialLoad;
    initialImg.onerror = (e) => {
      console.error('[ScrollStory] Failed to load frame 001 from URL:', initialImg.src, e);
      setLoadError(`Failed to load frame 001 from: ${initialImg.src}`);
    };

    if (typeof initialImg.decode === 'function') {
      initialImg.decode().then(onInitialLoad).catch(onInitialLoad);
    }

    const currentCache = cacheRef.current;
    const currentInFlight = inFlightRef.current;

    return () => {
      isDestroyedRef.current = true;
      brandLogo.onload = null;
      brandLogo.onerror = null;
      initialImg.onload = null;
      initialImg.onerror = null;
      currentCache.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = '';
      });
      currentCache.clear();
      currentInFlight.clear();
      queueRef.current = [];
    };
  }, [drawFrameToCanvas, processQueue]);

  // Viewport proximity tracking with IntersectionObserver
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isSectionNearRef.current = entry.isIntersecting;
      },
      { rootMargin: '350px 0px 350px 0px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // ResizeObserver to ensure canvas always redraws cleanly when layout settles
  useEffect(() => {
    const stickyViewport = stickyViewportRef.current;
    if (!stickyViewport || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => {
      const currentDrawn = lastDrawnFrameRef.current;
      const img = cacheRef.current.get(currentDrawn) || cacheRef.current.get(1);
      if (img) {
        drawFrameToCanvas(img, currentDrawn);
      }
    });

    ro.observe(stickyViewport);
    return () => ro.disconnect();
  }, [drawFrameToCanvas]);

  // Listen to scroll progress and request frames
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest);

      // Determine scroll direction
      const diff = latest - lastProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        scrollDirectionRef.current = diff > 0 ? 'forward' : 'backward';
      }
      lastProgressRef.current = latest;

      let targetFrame: number;
      if (prefersReducedMotion) {
        // Reduced motion: step between 4 representative keyframe states
        if (latest < 0.25) targetFrame = 1;
        else if (latest < 0.5) targetFrame = Math.round(TOTAL_FRAMES * (1 / 3));
        else if (latest < 0.75) targetFrame = Math.round(TOTAL_FRAMES * (2 / 3));
        else targetFrame = TOTAL_FRAMES;
      } else {
        // Continuous smooth frame interpolation from 1 to TOTAL_FRAMES
        targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + latest * (TOTAL_FRAMES - 1))));
      }

      requestFrame(targetFrame, scrollDirectionRef.current);
    });

    return () => unsubscribe();
  }, [scrollYProgress, requestFrame, prefersReducedMotion]);

  // Calculate visual properties for each story beat based on scrollProgress
  const beatStates = useMemo(() => {
    return STORY_BEATS.map((beat) => {
      const { startProgress, peakStart, peakEnd, endProgress } = beat;
      if (scrollProgress < startProgress || scrollProgress > endProgress) {
        return { ...beat, opacity: 0, translateY: 14, blur: 4, isVisible: false };
      }
      if (scrollProgress < peakStart) {
        const t = (scrollProgress - startProgress) / (peakStart - startProgress);
        return {
          ...beat,
          opacity: t,
          translateY: (1 - t) * 14,
          blur: (1 - t) * 4,
          isVisible: true,
        };
      }
      if (scrollProgress <= peakEnd) {
        return { ...beat, opacity: 1, translateY: 0, blur: 0, isVisible: true };
      }
      // Fading out
      const t = (scrollProgress - peakEnd) / (endProgress - peakEnd);
      return {
        ...beat,
        opacity: Math.max(0, 1 - t),
        translateY: -t * 14,
        blur: t * 4,
        isVisible: true,
      };
    });
  }, [scrollProgress]);

  return (
    <>
      {/* 1. OUR STORY HEADING: normal flow above the cinematic sequence with seamless dark transition */}
      <div className="w-full bg-[#03070d] text-white relative z-10">
        <div className="our-story-heading wrap pt-8 sm:pt-10 pb-0 text-center">
          <SectionHeading
            eyebrow="A closer look"
            wordmarkText="Our Story"
            description="Where curiosity turns into engineering — bridging the gap between theoretical concepts and real implementation."
            className="mb-0 sm:mb-0"
          />
        </div>
      </div>

      {/* 2. SCROLL-STORY: parent is ONLY responsible for providing scroll distance (280vh mobile, 320vh desktop) */}
      <section
        ref={scrollContainerRef}
        aria-label="aiDEAS Story cinematic sequence"
        className="scroll-story relative w-full h-[280vh] md:h-[320vh] bg-[#03070d]"
      >
        {/* 3. SCROLL-STORY-STICKY: the ENTIRE visual experience pinned to the viewport */}
        <div
          ref={stickyViewportRef}
          className="scroll-story-sticky sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#03070d]"
        >
          {/* Edge-to-edge Canvas */}
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none select-none block"
          />

          {/* Subtle cinematic vignette & top edge transition: approximately 80px feathered fade into background */}
          <div
            aria-hidden="true"
            className="cinematic-vignette-overlay absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: `
                radial-gradient(ellipse 88% 82% at 50% 50%, transparent 50%, rgba(3, 7, 13, 0.25) 70%, rgba(3, 7, 13, 0.75) 88%, #03070d 100%),
                linear-gradient(to bottom, #03070d 0%, rgba(3, 7, 13, 0.5) 30px, transparent 80px, transparent calc(100% - 70px), rgba(3, 7, 13, 0.7) calc(100% - 25px), #03070d 100%),
                linear-gradient(to right, #03070d 0%, rgba(3, 7, 13, 0.5) 2%, transparent 8%, transparent 92%, rgba(3, 7, 13, 0.5) 98%, #03070d 100%)
              `,
            }}
          />

          {/* Gentle atmospheric gradient behind text for flawless readability (no opaque cards) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-[#03070d]/80 via-[#03070d]/30 to-transparent pointer-events-none z-[2]"
          />
          <div
            aria-hidden="true"
            className="md:hidden absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#03070d]/90 via-[#03070d]/40 to-transparent pointer-events-none z-[3]"
          />

          {/* Floating Editorial Typography */}
          <div className="story-text-overlay relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-full flex flex-col justify-end md:justify-center pb-12 sm:pb-16 md:pb-0 pointer-events-none select-none">
            <div className="relative max-w-lg lg:max-w-xl">
              {/* Overlapping Text Story Beats: smoothly cross-faded by scroll */}
              <div className="relative min-h-[155px] sm:min-h-[170px]">
                {beatStates.map((beat) => {
                  if (!beat.isVisible && beat.opacity === 0) return null;

                  return (
                    <article
                      key={beat.id}
                      aria-hidden={!beat.isVisible}
                      className="absolute inset-0 flex flex-col justify-start transition-none"
                      style={{
                        opacity: beat.opacity,
                        transform: prefersReducedMotion ? 'none' : `translateY(${beat.translateY}px)`,
                        filter: prefersReducedMotion ? 'none' : `blur(${beat.blur}px)`,
                      }}
                    >
                      {/* Eyebrow badge */}
                      <div className="inline-flex items-center gap-2 mb-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: beat.accent,
                            boxShadow: `0 0 6px ${beat.accent}`,
                          }}
                        />
                        <span
                          className="tracking-[0.24em] sm:tracking-[0.28em] uppercase font-medium text-[11px] sm:text-[12px]"
                          style={{
                            fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)',
                            color: 'rgba(145, 165, 190, 0.88)',
                          }}
                        >
                          {beat.eyebrow}
                        </span>
                      </div>

                      {/* Headline */}
                      <h3
                        className="font-extrabold tracking-tight text-white mb-2 sm:mb-2.5"
                        style={{
                          fontFamily: 'var(--font-inter, Inter, "Geist", system-ui, sans-serif)',
                          fontSize: 'clamp(28px, 4vw, 44px)',
                          lineHeight: '1.14',
                          textShadow: '0 2px 16px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0, 0, 0, 0.6)',
                        }}
                      >
                        {beat.headline}
                      </h3>

                      {/* Supporting line */}
                      <p
                        className="font-normal"
                        style={{
                          fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)',
                          fontSize: 'clamp(14px, 1.25vw, 16px)',
                          lineHeight: '1.65',
                          color: 'rgba(180, 198, 220, 0.95)',
                          textShadow: '0 1px 10px rgba(0, 0, 0, 0.9)',
                        }}
                      >
                        {beat.supporting}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Visible diagnostic if frame 1 asset fails to load */}
          {loadError && (
            <div className="absolute top-4 left-4 z-50 p-3 bg-red-950/80 border border-red-500 rounded text-red-200 text-xs font-mono">
              {loadError}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
