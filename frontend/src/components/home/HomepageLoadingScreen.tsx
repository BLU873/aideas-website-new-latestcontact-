"use client";

import { useEffect, useRef, useState } from "react";

/* ─── constants ──────────────────────────────────────────────────────────── */
const SESSION_KEY = "aideas-loader-seen";
const MIN_DISPLAY_MS = 3000;
const SAFETY_TIMEOUT_MS = 6500;

/* Restrained palette — not neon */
const SHAFT_CYAN = "rgba(48, 160, 200, 1)";   // muted steel-cyan
const SHAFT_MIST = "rgba(140, 120, 200, 1)";  // very faint violet-mist

/* ─── helpers ─────────────────────────────────────────────── */

/* ─── Canvas: editorial light-shaft wordmark ─────────────────────────────── */
import { motion } from "framer-motion";

function ModernAILoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020712] overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Futuristic 3D Rings & Core */}
      <div className="relative w-64 h-64 flex items-center justify-center z-10">
        
        {/* Ring 1 - Cyan */}
        <motion.div
          animate={{ rotateZ: 360, rotateX: [60, 75, 60], rotateY: [20, -20, 20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-[2px] border-cyan-500/40 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          style={{ transformStyle: "preserve-3d" }}
        />
        
        {/* Ring 2 - Blue */}
        <motion.div
          animate={{ rotateZ: -360, rotateX: [70, 50, 70], rotateY: [-30, 30, -30] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border-[1px] border-blue-500/30 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          style={{ transformStyle: "preserve-3d" }}
        />

        {/* Ring 3 - Purple */}
        <motion.div
          animate={{ rotateZ: 360, rotateX: [40, 80, 40], rotateY: [40, -10, 40] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 border-[1px] border-purple-500/20 rounded-full border-dashed"
          style={{ transformStyle: "preserve-3d" }}
        />

        {/* Central Core Pulse */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-24 h-24 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full blur-[15px] opacity-70"
        />
        
        {/* Core Center Dot */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-12 h-12 bg-white rounded-full shadow-[0_0_30px_#fff,0_0_60px_#06b6d4]"
        />
      </div>

      {/* Cinematic Text Reveal */}
      <div className="mt-16 flex flex-col items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200"
          style={{ fontFamily: "var(--font-orbitron, system-ui)" }}
        >
          aIDEAS
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-4 flex items-center gap-3 text-cyan-400/80 font-mono text-xs md:text-sm tracking-[0.3em] uppercase"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
          />
          Initializing Neural Engine
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
/*
 * FLASH FIX STRATEGY
 * ------------------
 * The component starts with `visible = "pending"`.
 * On first render (SSR or hydration) it renders a plain black overlay div.
 * This div is already in the DOM before any client effects run, so the
 * Hero is ALWAYS covered on initial paint.
 *
 * In the useEffect (client only) we check sessionStorage:
 *   - already seen → instantly remove the overlay (setVisible("hidden"))
 *   - not seen     → start canvas + timers (setVisible("showing"))
 *
 * The result: no Hero flash on first visit.
 * On return visits the overlay disappears in a single synchronous effect
 * before the first frame is painted by the browser.
 */

type LoaderState = "pending" | "showing" | "exiting" | "hidden";

let hasPlayedInThisContext = false;

export default function HomepageLoadingScreen() {
  const [state, setState] = useState<LoaderState>("pending");
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hasPlayedInThisContext) {
      // If navigating internally (e.g. clicking "Home"), skip the loading screen
      setState("hidden");
      return;
    }

    setState("showing");
    let isExiting = false;
    const mountTime = Date.now();

    // Fix for React 18 StrictMode double-mount bug in dev server:
    // Delay setting the flag so the phantom unmount can cancel it.
    const strictModeTimer = setTimeout(() => {
      hasPlayedInThisContext = true;
    }, 100);

    function handleSplineLoaded() {
      if (!isExiting) {
        isExiting = true;
        
        // Wait exactly enough time (350ms) for WebGL to paint the first frame to the screen
        setTimeout(startExit, 350);
      }
    }

    // Listen for the custom event from splite.tsx
    window.addEventListener("spline-loaded", handleSplineLoaded);

    // Fallback safety timer just in case Spline fails or takes > 8s
    const safetyTimer = setTimeout(() => {
      if (!isExiting) {
        isExiting = true;
        startExit();
      }
    }, 8000);

    return () => {
      clearTimeout(strictModeTimer);
      window.removeEventListener("spline-loaded", handleSplineLoaded);
      clearTimeout(safetyTimer);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  function startExit() {
    setState("exiting");
    exitTimerRef.current = setTimeout(() => setState("hidden"), 650);
  }

  if (state === "hidden") return null;

  /* "pending" renders a plain black panel (no canvas) to cover the Hero
     until the useEffect determines whether to show or hide.
     "showing" / "exiting" renders the full animated overlay. */
  const isAnimating = state === "showing" || state === "exiting";

  return (
    <div
      id="aideas-homepage-loader"
      aria-label="Loading aiDEAS"
      role="status"
      style={{
        position   : "fixed",
        inset      : 0,
        zIndex     : 9999,
        overflow   : "hidden",
        pointerEvents: state === "exiting" ? "none" : "all",
        background : isAnimating ? "transparent" : "#020712",
        opacity    : state === "exiting" ? 0 : 1,
        transition : state === "exiting"
          ? "opacity 0.7s cubic-bezier(0.4,0,0.2,1)"
          : "none",
      }}
    >
      {isAnimating && <ModernAILoader />}
    </div>
  );
}
