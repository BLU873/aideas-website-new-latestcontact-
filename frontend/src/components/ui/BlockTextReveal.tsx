'use client';

/**
 * BlockTextReveal
 *
 * Adapted from the Originkit BlockTextReveal reference implementation.
 * Stripped to the "lines" reveal mode with left-align — the only mode needed
 * for the Contact page paragraph. Unused modes (blocks, center-split, highlights,
 * canvas-hold, highlight blocks) are removed to keep the bundle minimal.
 *
 * How it works:
 *  1. Words are rendered as invisible inline-block spans.
 *  2. After fonts load + first layout, each text line's bounding rect is measured.
 *  3. A colored "wiper" span, scaled from 0→1 then 1→0 on the X axis, sweeps
 *     across each line (staggered by line index). When the wiper exits, the word
 *     opacity flips to 1 — revealing text cleanly without cumulative shift.
 *  4. The whole animation fires once when the host element enters the viewport.
 *  5. prefers-reduced-motion: skips the animation and shows text immediately.
 */

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// ---------------------------------------------------------------------------
// Constants (mirrored from Originkit reference)
// ---------------------------------------------------------------------------

const PER_LINE_SPAN = 0.85;      // fraction of normalised time each line gets
const STAGGER_STEP = 0.07;       // delay per line as fraction of PER_LINE_SPAN
const ENTER_END = 0.45;          // normalised position where wiper starts retracting
const BASE_DURATION_MS = 2000;
const SPEED_DIVISOR = 25;
const LINE_PAD_X = 2;            // px padding either side of a line's wiper
const LINE_TOP_LIFT = 0.08;      // fraction of font-size to lift wiper above baseline
const LINE_HEIGHT_FACTOR = 1.18; // wiper height relative to font-size

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const px = (n: number) => (Number.isFinite(n) ? Math.round(n * 1e3) / 1e3 : 0);

// ---------------------------------------------------------------------------
// Word / line types
// ---------------------------------------------------------------------------

interface WordToken {
  text: string;
  breaks: number; // number of <br> nodes after this word
}

interface WordRect {
  x: number;
  y: number;
  w: number;
  yText: number;
  hText: number;
  line: number;
}

interface LineRect {
  line: number;
  minX: number;
  maxX: number;
  yText: number;
  hText: number;
}

interface Measurement {
  rects: WordRect[];
  lines: LineRect[];
  lineCount: number;
  sig: string;
}

// ---------------------------------------------------------------------------
// Parse text into word tokens (respects \n line breaks)
// ---------------------------------------------------------------------------

function parseWords(text: string): WordToken[] {
  const out: WordToken[] = [];
  const lines = String(text ?? '').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(/\s+/);
    for (const p of parts) if (p) out.push({ text: p, breaks: 0 });
    if (i < lines.length - 1 && out.length > 0)
      out[out.length - 1].breaks += 1;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BlockTextRevealProps {
  text: string;
  /** CSS color string for the wiper block */
  blockColor?: string;
  /** CSS color string for the revealed text */
  textColor?: string;
  /** Font size (any valid CSS value, e.g. "17.5px") */
  fontSize?: string;
  /** Line height (any valid CSS value, e.g. "1.7") */
  lineHeight?: string;
  /** Font weight */
  fontWeight?: number | string;
  /** Maximum width wrapper class (Tailwind or empty) */
  className?: string;
  /** Animation speed — higher = faster. Matches Originkit's speed prop (default 50) */
  speed?: number;
  /** Optional subtle text-shadow for readability and atmospheric glow */
  textShadow?: string;
}

// ---------------------------------------------------------------------------
// useIsomorphicLayoutEffect
// ---------------------------------------------------------------------------

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BlockTextReveal({
  text,
  blockColor = '#1e2a3a',
  textColor = '#9aa3b0',
  fontSize = '17.5px',
  lineHeight = '1.7',
  fontWeight = 400,
  textShadow,
  className = '',
  speed = 50,
}: BlockTextRevealProps) {
  // --- reduced-motion gate ---------------------------------------------------
  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const words = useMemo(() => parseWords(text), [text]);

  // refs to measured DOM elements
  const hostRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const wordElsRef = useRef<(HTMLElement | null)[]>([]);
  const strutElsRef = useRef<(HTMLElement | null)[]>([]);
  const wiperElsRef = useRef<(HTMLElement | null)[]>([]); // one per line

  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const measureRef = useRef<Measurement | null>(null);
  measureRef.current = measurement;

  const progressRef = useRef(prefersReduced ? 1 : 0);

  // Reset element ref arrays when words change
  const wordsKeyRef = useRef<WordToken[] | null>(null);
  if (wordsKeyRef.current !== words) {
    wordsKeyRef.current = words;
    wordElsRef.current = [];
    strutElsRef.current = [];
  }

  // -------------------------------------------------------------------------
  // Measure
  // -------------------------------------------------------------------------

  const measure = () => {
    const host = textRef.current;
    if (!host || typeof window === 'undefined') return;
    const els = wordElsRef.current;
    if (els.length === 0) return;

    const baseCS = window.getComputedStyle(host);
    const rects: WordRect[] = [];
    let lineIdx = -1;
    let lineBaseline = Number.NaN;

    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (!el) continue;
      const strut = strutElsRef.current[i];
      const baseline = el.offsetTop + (strut ? strut.offsetTop : 0);
      if (!Number.isFinite(lineBaseline) || baseline - lineBaseline > 0.5) {
        lineIdx += 1;
        lineBaseline = baseline;
      }
      const fontSizePx = parseFloat(baseCS.fontSize);
      const lineHeightPx = parseFloat(baseCS.lineHeight);
      const safeFont =
        Number.isFinite(fontSizePx) && fontSizePx > 0
          ? fontSizePx
          : el.offsetHeight;
      const safeLine =
        Number.isFinite(lineHeightPx) && lineHeightPx > 0
          ? lineHeightPx
          : el.offsetHeight;

      rects.push({
        x: el.offsetLeft,
        y: el.offsetTop,
        w: el.offsetWidth,
        yText: el.offsetTop + Math.max(0, (safeLine - safeFont) / 2),
        hText: safeFont,
        line: Math.max(0, lineIdx),
      });
    }

    if (rects.length === 0) return;

    const lineCount = Math.max(1, lineIdx + 1);
    const lines: LineRect[] = [];
    for (let li = 0; li < lineCount; li++) {
      let minX = Infinity, maxX = -Infinity, top = Infinity, bottom = -Infinity;
      let has = false;
      for (const r of rects) {
        if (r.line !== li) continue;
        has = true;
        minX = Math.min(minX, r.x);
        maxX = Math.max(maxX, r.x + r.w);
        top = Math.min(top, r.yText);
        bottom = Math.max(bottom, r.yText + r.hText);
      }
      if (!has || !Number.isFinite(minX)) continue;
      lines.push({
        line: li,
        minX,
        maxX,
        yText: top,
        hText: Math.max(1, bottom - top),
      });
    }

    const sig = rects
      .map(
        (r) =>
          `${Math.round(r.x)},${Math.round(r.yText)},${Math.round(r.w)},${Math.round(r.hText)},${r.line}`,
      )
      .join('|');
    if (measureRef.current?.sig === sig) return;
    setMeasurement({ rects, lines, lineCount, sig });
  };

  const measureFnRef = useRef(measure);
  measureFnRef.current = measure;

  useIsomorphicLayoutEffect(() => {
    measureFnRef.current();
  }, [words]);

  // Re-measure on resize
  useEffect(() => {
    const el = textRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let raf = 0;
    const obs = new ResizeObserver(() => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        measureFnRef.current();
      });
    });
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Re-measure after fonts load
  useEffect(() => {
    const fonts = (
      document as unknown as { fonts?: { ready?: Promise<unknown> } }
    ).fonts;
    if (!fonts?.ready) return;
    let alive = true;
    fonts.ready.then(() => {
      if (alive) measureFnRef.current();
    });
    return () => {
      alive = false;
    };
  }, [fontSize, fontWeight]);

  // -------------------------------------------------------------------------
  // Apply progress to DOM (no React state → no re-render during animation)
  // -------------------------------------------------------------------------

  const applyProgress = (p: number) => {
    const m = measureRef.current;
    if (!m) return;
    const { rects, lines, lineCount } = m;

    const delayStep = PER_LINE_SPAN * STAGGER_STEP;
    const timeline = PER_LINE_SPAN + delayStep * Math.max(0, lineCount - 1);
    const exitDuration = Math.max(1e-5, 1 - ENTER_END);

    // Wiper panels (one per line)
    for (const lr of lines) {
      const el = wiperElsRef.current[lr.line];
      if (!el) continue;
      const local = clamp01(
        (p * timeline - lr.line * delayStep) / Math.max(1e-4, PER_LINE_SPAN),
      );
      const entering = local < ENTER_END;
      const sx = entering
        ? easeOutCubic(local / Math.max(1e-5, ENTER_END))
        : Math.max(0, 1 - easeOutCubic((local - ENTER_END) / exitDuration));
      const hide = (lr.maxX - lr.minX + LINE_PAD_X * 2) * sx <= 1;
      if (hide) {
        el.style.visibility = 'hidden';
      } else {
        el.style.visibility = 'visible';
        el.style.transformOrigin = entering ? '100% 50%' : '0% 50%';
        el.style.transform = `scaleX(${px(sx)})`;
      }
    }

    // Word opacity: visible once the wiper has passed
    for (let i = 0; i < rects.length; i++) {
      const el = wordElsRef.current[i];
      if (!el) continue;
      const local = clamp01(
        (p * timeline - rects[i].line * delayStep) /
          Math.max(1e-4, PER_LINE_SPAN),
      );
      el.style.opacity = local >= ENTER_END ? '1' : '0';
    }
  };

  const applyRef = useRef(applyProgress);
  applyRef.current = applyProgress;

  // Sync DOM after each React render (measurement changes trigger re-render)
  useIsomorphicLayoutEffect(() => {
    applyRef.current(progressRef.current);
  });

  // -------------------------------------------------------------------------
  // Viewport trigger → animation
  // -------------------------------------------------------------------------

  const lineCount = measurement?.lineCount ?? 1;

  useEffect(() => {
    if (prefersReduced) {
      // Show text immediately without animation
      progressRef.current = 1;
      applyRef.current(1);
      return;
    }

    if (typeof window === 'undefined') return;

    let raf = 0;
    let armed = true;
    progressRef.current = 0;
    applyRef.current(0);

    const durationMs = () => {
      const factor = Math.max(0.1, speed / SPEED_DIVISOR);
      const base = BASE_DURATION_MS / factor;
      const delayStep = PER_LINE_SPAN * STAGGER_STEP;
      const timeline = PER_LINE_SPAN + delayStep * Math.max(0, lineCount - 1);
      return base * (timeline / PER_LINE_SPAN);
    };

    const play = () => {
      const duration = Math.max(1, durationMs());
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = clamp01((now - t0) / duration);
        progressRef.current = t;
        applyRef.current(t);
        if (t < 1) raf = requestAnimationFrame(tick);
        else raf = 0;
      };
      raf = requestAnimationFrame(tick);
    };

    const check = () => {
      if (!armed) return;
      const el = hostRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      // Trigger when the top of the element crosses the viewport center
      if (rect.top <= vh / 2) {
        armed = false;
        window.removeEventListener('scroll', check);
        window.removeEventListener('resize', check);
        play();
      }
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);

    return () => {
      armed = false;
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [prefersReduced, speed, lineCount]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div ref={hostRef} className={className} style={{ position: 'relative', overflow: 'visible' }}>
      {/* Accessible text — always visible to screen readers */}
      <span className="sr-only">{text}</span>

      <p
        ref={textRef}
        aria-hidden="true"
        style={{
          margin: 0,
          position: 'relative',
          color: textColor,
          fontSize,
          lineHeight,
          fontWeight,
          ...(textShadow ? { textShadow } : {}),
        }}
      >
        {/* Wiper overlays — one per measured line, rendered after measurement */}
        {measurement && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 2,
              overflow: 'hidden',
            }}
          >
            {measurement.lines.map((lr) => (
              <span
                key={`wiper-${lr.line}`}
                ref={(el) => {
                  wiperElsRef.current[lr.line] = el;
                }}
                style={{
                  position: 'absolute',
                  left: px(lr.minX - LINE_PAD_X),
                  top: px(lr.yText - lr.hText * LINE_TOP_LIFT),
                  width: px(lr.maxX - lr.minX + LINE_PAD_X * 2),
                  height: px(lr.hText * LINE_HEIGHT_FACTOR),
                  background: blockColor,
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                }}
              />
            ))}
          </span>
        )}

        {/* Word spans */}
        {words.map((word, i) => {
          const breaks: React.ReactNode[] = [];
          for (let b = 0; b < word.breaks; b++)
            breaks.push(<br key={`br-${i}-${b}`} />);
          return (
            <React.Fragment key={`word-${i}`}>
              <span
                ref={(el) => {
                  wordElsRef.current[i] = el;
                }}
                style={{
                  display: 'inline-block',
                  marginRight: '0.25em',
                  verticalAlign: 'baseline',
                  lineHeight: 'inherit',
                  position: 'relative',
                  zIndex: 1,
                  opacity: prefersReduced ? 1 : 0,
                  transition: 'none',
                }}
              >
                {/* Strut — zero-size element used to find the line's true baseline */}
                <span
                  ref={(el) => {
                    strutElsRef.current[i] = el;
                  }}
                  aria-hidden="true"
                  style={{ display: 'inline-block', width: 0, height: 0 }}
                />
                {word.text}
              </span>
              {breaks}
            </React.Fragment>
          );
        })}
      </p>
    </div>
  );
}
