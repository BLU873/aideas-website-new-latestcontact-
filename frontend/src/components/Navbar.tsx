'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      localStorage.removeItem('aideas-theme');
    } catch {}
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

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
        <Link href="/" className="brand flex items-center gap-3" aria-label="aiDEAS Home">
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

        {/* Mobile Menu Burger */}
        <div className="flex items-center">
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