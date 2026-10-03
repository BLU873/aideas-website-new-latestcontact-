'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);
  const isScrolledRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 30;
      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let saved: 'dark' | 'light' = 'dark';
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      try {
        saved = (localStorage.getItem('aideas-theme') as 'dark' | 'light') || 'dark';
      } catch {}
    }
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      try {
        localStorage.setItem('aideas-theme', next);
      } catch {}
    }
    document.documentElement.setAttribute('data-theme', next);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Spotlight', path: '/spotlight' },
    { name: 'Team', path: '/members' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className={isScrolled ? 'header-floating' : ''}>
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="brand group relative flex items-center gap-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 rounded-lg"
          aria-label="aiDEAS Home"
        >
          <Image
            src="/assets/img/logo-icon.png"
            alt="aiDEAS logo"
            width={42}
            height={42}
            className="rounded-full shadow-md shrink-0"
            priority
          />
          <span className="brand-name font-extrabold text-xl tracking-tight">
            <span className="ai text-cyan-400">aI</span>
            <span className="deas bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">DEAS</span>
          </span>

          {/* Identity hover/focus tooltip */}
          <span
            role="tooltip"
            className="pointer-events-none absolute left-0 top-[calc(100%+6px)] z-50 whitespace-nowrap rounded-md border border-white/10 bg-[#0c1017]/95 px-2.5 py-1 text-[10px] font-medium tracking-[0.14em] uppercase text-gray-300 opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 -translate-y-1"
            style={{
              fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)',
              boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            }}
          >
            PVG AI &amp; DS DEPARTMENT CLUB
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative transition-all duration-300 ${
                  isActive
                    ? 'text-cyan-400 font-semibold'
                    : 'text-gray-300 hover:text-cyan-300'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Controls: Theme Switcher & Mobile Menu Burger */}
        <div className="flex items-center gap-4">
          <button
            className="theme-toggle p-2 rounded-full border border-gray-800 hover:border-cyan-500/50 transition-colors"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ opacity: mounted ? 1 : 0 }}
          >
            {theme === 'dark' ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            className={`burger md:hidden ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#0A0B16] border-b border-gray-800 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`block text-base font-medium ${
                pathname === link.path ? 'text-cyan-400 font-semibold' : 'text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}