'use client';

/**
 * TypewriterHeadline
 *
 * Adapted from the Originkit TypewriterText reference.
 * State machine: typing → holding → deleting → (advance phrase) → typing → …
 *
 * Key design decisions:
 *  - setTimeout-based character steps (not GSAP) — no heavy dependency for a simple effect
 *  - CSS Grid invisible sizer reserves space for the longest phrase → zero layout shift
 *  - prefers-reduced-motion: skip animation, show the first phrase statically
 *  - Accessible: aria-live="polite" + aria-atomic="true" announces completed phrases;
 *    the animated span is aria-hidden so screen readers don't announce each character
 *  - Blinking cursor is a styled <span> with a CSS animation injected via <style>
 *  - All timeouts are tracked via a single ref and cleared on unmount (React Strict Mode safe)
 */

import React, { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Cursor blink keyframe (injected once, scoped class name)
// ---------------------------------------------------------------------------

const CURSOR_STYLE = `
@keyframes tw-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
.tw-cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 2px;
  vertical-align: text-bottom;
  border-radius: 1px;
  background: #38d1ff;
  animation: tw-blink 1.1s step-start infinite;
}
@media (prefers-reduced-motion: reduce) {
  .tw-cursor { animation: none; opacity: 1; }
}
`;

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

type Phase = 'typing' | 'holding' | 'deleting';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TypewriterHeadlineProps {
  /** Phrases to cycle through in order */
  texts: string[];
  /** Milliseconds between each typed character */
  typeSpeed?: number;
  /** Milliseconds between each deleted character */
  deleteSpeed?: number;
  /** Milliseconds to pause after fully typing a phrase */
  pauseMs?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TypewriterHeadline({
  texts,
  typeSpeed = 52,
  deleteSpeed = 30,
  pauseMs = 1400,
}: TypewriterHeadlineProps) {
  const safeTexts = texts.length > 0 ? texts : ['Loading…'];

  // Detect reduced-motion preference once on mount
  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const [displayed, setDisplayed] = useState<string>(
    prefersReduced ? safeTexts[0] : '',
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');

  // Track the announced (completed) phrase for the live region
  const [announced, setAnnounced] = useState<string>(safeTexts[0]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inject cursor CSS once
  const styleInjected = useRef(false);
  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const el = document.createElement('style');
    el.textContent = CURSOR_STYLE;
    document.head.appendChild(el);
  }, []);

  // Main animation loop
  useEffect(() => {
    // Bail out completely for reduced-motion — static display only
    if (prefersReduced) return;

    const current = safeTexts[phraseIndex] ?? '';

    const clear = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, typeSpeed);
      } else {
        // Fully typed — announce and move to hold
        setAnnounced(current);
        timeoutRef.current = setTimeout(() => setPhase('holding'), pauseMs);
      }
    } else if (phase === 'holding') {
      timeoutRef.current = setTimeout(() => setPhase('deleting'), 0);
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed((prev) => prev.slice(0, -1));
        }, deleteSpeed);
      } else {
        // Fully deleted — advance to next phrase
        const next = (phraseIndex + 1) % safeTexts.length;
        setPhraseIndex(next);
        setPhase('typing');
      }
    }

    return clear;
  }, [displayed, phase, phraseIndex, safeTexts, typeSpeed, deleteSpeed, pauseMs, prefersReduced]);

  // Longest phrase — used by the invisible sizer to reserve stable width
  const longestPhrase = safeTexts.reduce(
    (a, b) => (b.length > a.length ? b : a),
    '',
  );

  return (
    <div
      className="flex flex-col items-center select-none"
      aria-label={announced}
    >
      {/* Accessible live region: announces the complete phrase, not every keystroke */}
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {announced}
      </span>

      {/*
       * Layout-safe wrapper:
       * CSS Grid stacks the invisible sizer and the animated text in the same
       * grid cell so the container is always as wide as the longest phrase.
       * overflow-hidden keeps the cursor from causing horizontal scroll.
       */}
      <div
        aria-hidden="true"
        className="grid grid-cols-1 grid-rows-1 overflow-hidden"
        style={{ lineHeight: '1.3' }}
      >
        {/* Invisible sizer — reserves space for the longest phrase + cursor width */}
        <span
          className="col-start-1 row-start-1 invisible pointer-events-none whitespace-nowrap"
          style={{ lineHeight: '1.3' }}
        >
          {longestPhrase}
          {/* Reserve cursor width */}
          <span style={{ display: 'inline-block', width: '4px' }} />
        </span>

        {/* Animated text + cursor, centered over the sizer */}
        <span
          className="col-start-1 row-start-1 flex items-center justify-center whitespace-nowrap"
          style={{
            lineHeight: '1.3',
            background: 'linear-gradient(90deg, #38d1ff 0%, #60a5fa 50%, #b06bff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          <span style={{ WebkitTextFillColor: 'transparent' }}>{displayed}</span>
          {/* Cursor — needs its own color, not inheriting the gradient text-fill */}
          <span
            className="tw-cursor shrink-0"
            style={{ WebkitTextFillColor: 'initial', color: '#38d1ff' }}
          />
        </span>
      </div>
    </div>
  );
}
