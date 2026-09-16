'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { Card } from '@/components/ui/card';
import FlowRibbons from '@/components/ui/FlowRibbons';

const WORDS = ['Future Leaders', 'Builders', 'Innovators', 'Researchers', 'Creators'];

function useTypewriter(words: string[]) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx % words.length];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 55);
      } else {
        timeout = setTimeout(() => setDeleting(true), 1400);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
      } else {
        setDeleting(false);
        setWordIdx((i) => i + 1);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx, words]);

  return displayed;
}

function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add('in');
        }),
      { threshold: 0.12 }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);
  return ref;
}

export function Hero() {
  const word = useTypewriter(WORDS);
  const sectionRef = useReveal() as React.RefObject<HTMLElement>;
  const [r2Phase, setR2Phase] = useState<'hidden' | 'shown'>('hidden');

  useEffect(() => {
    const fadeIn = setTimeout(() => setR2Phase('shown'), 400);
    const fadeOut = setTimeout(() => setR2Phase('hidden'), 5000);
    return () => {
      clearTimeout(fadeIn);
      clearTimeout(fadeOut);
    };
  }, []);

  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = document.querySelector('#home')?.nextElementSibling as HTMLElement;
    next?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" ref={sectionRef as React.RefObject<HTMLElement>}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.8, pointerEvents: 'none' }}>
        <FlowRibbons />
      </div>
      <div className="wrap hero-inner">
        {/* Left copy */}
        <div className="hero-copy">
          <h1
            data-reveal="zoom"
            className="hero-title"
            style={{
              transitionDelay: '.15s',
              fontFamily: '"Orbitron", sans-serif',
              lineHeight: '1.2',
              fontSize: 'clamp(40px, 6vw, 76px)',
              fontWeight: 800,
            }}
          >
            <span style={{ color: '#ffffff' }}>Welcome to </span>
            <span style={{ color: '#a855f7' }}>ai</span>
            <span style={{ color: '#38bdf8' }}>DEAS</span>
          </h1>
          <p className="empower-line" data-reveal style={{ transitionDelay: '.25s' }}>
            Empowering&nbsp;
            <span className="type-target">{word}</span>
            <span className="cursor" aria-hidden="true">
              |
            </span>
          </p>
          <div className="hero-actions" data-reveal style={{ transitionDelay: '.35s' }}>
            <Link href="/about" className="btn btn-primary btn-pulse">
              Explore Now &rarr;
            </Link>
            <Link href="/events" className="btn btn-ghost">
              See Events
            </Link>
          </div>
        </div>

        {/* Right Spline 3D scene */}
        <div className="hero-visual" data-reveal style={{ transitionDelay: '.2s' }}>
          <Card
            className="w-full h-[460px] sm:h-[480px] md:h-[500px] relative overflow-hidden border-white/10"
            style={{
              backgroundColor: 'rgba(12, 14, 17, 0.97)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(180, 185, 195, 0.14)',
              borderRadius: '0.5rem',
            }}
          >
            {/* Gray aura — diffuse studio-light haze behind the robot */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                opacity: 0.6,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  aspectRatio: '1 / 1',
                  background:
                    'radial-gradient(circle at 50% 48%, rgba(190, 195, 205, 0.16) 0%, rgba(150, 155, 165, 0.09) 25%, rgba(80, 85, 95, 0.04) 48%, transparent 72%)',
                  filter: 'blur(60px)',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
            <div className="w-full h-full relative">
              {/* Permanent text above the head */}
              <div
                style={{
                  position: 'absolute',
                  top: '8%',
                  left: '50%',
                  transform: 'translate(-50%, 0)',
                  zIndex: 0,
                  opacity: 0.4,
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: 'clamp(1rem, 3.5vw, 2.2rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.12em',
                  pointerEvents: 'none',
                  textAlign: 'center',
                  width: '100%',
                  textTransform: 'uppercase',
                  padding: '0 12px',
                }}
              >
                MAKING MACHINES INTELLIGENT
              </div>

              {/* R2D2 introduction (fades in, holds, fades out) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '8%',
                  left: '50%',
                  transform: 'translate(-50%, 0)',
                  zIndex: 0,
                  opacity: r2Phase === 'shown' ? 0.9 : 0,
                  transition: 'opacity 1.4s ease-in-out',
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: 'clamp(1.1rem, 2.8vw, 1.8rem)',
                  fontWeight: 600,
                  letterSpacing: '0.35em',
                  textIndent: '0.35em',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  textAlign: 'center',
                }}
              >
                <span style={{ color: '#e8eaed' }}>MEET&nbsp;</span>
                <span style={{ color: '#7cc4e8' }}>R2D2</span>
              </div>
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full relative z-10"
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Scroll cue */}
      <a href="#" className="scroll-cue" aria-label="Scroll down" onClick={handleScrollDown}>
        <span />
      </a>
    </section>
  );
}

export default Hero;
