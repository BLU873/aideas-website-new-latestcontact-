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

function MinimalLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <motion.h1
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl md:text-7xl font-bold tracking-[0.2em] text-white"
          style={{ fontFamily: "var(--font-orbitron, system-ui)" }}
        >
          aIDEAS
        </motion.h1>
        
        <div className="mt-8 relative w-48 h-[1px] bg-white/10 overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-y-0 w-1/2 bg-white"
          />
        </div>
      </motion.div>
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
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        pointerEvents: state === "exiting" ? "none" : "all",
        background: isAnimating ? "transparent" : "#000000",
        opacity: state === "exiting" ? 0 : 1,
        transition: state === "exiting"
          ? "opacity 0.60s cubic-bezier(0.4,0,0.2,1)"
          : "none",
      }}
    >
      {isAnimating && <MinimalLoader />}
    </div>
  );
}
