'use client';

import React, { useState, useRef, useEffect } from 'react';
import TypewriterHeadline from '@/components/ui/RotatingHeadline';
import BorderGlow from '@/components/ui/BorderGlow';
import BlockTextReveal from '@/components/ui/BlockTextReveal';
import GlobeWireframe from '@/components/ui/GlobeWireframe';
import {
  FaLinkedin,
  FaInstagram,
  FaCheckCircle,
  FaExclamationCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from 'react-icons/fa';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Responsive check
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mql.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setStatus({ type: null, message: '' });

    const form = e.currentTarget;
    const name = (form.elements.namedItem('Name') as HTMLInputElement)?.value?.trim() || '';
    const email = (form.elements.namedItem('Email') as HTMLInputElement)?.value?.trim() || '';
    const message = (form.elements.namedItem('Message') as HTMLTextAreaElement)?.value?.trim() || '';

    // Field Validation
    if (!name || !email || !message) {
      setStatus({
        type: 'error',
        message: 'Please fill in all required fields before sending.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      return;
    }

    setIsSubmitting(true);

    // Verified EmailJS service, template and public key configuration
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_enquiry';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_s7wg2wc';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '7kPIrVieTXbxkwLkj';

    // Target recipient is verified college email address: aideas@pvgcoet.ac.in
    const templateParams = {
      to_email: 'aideas@pvgcoet.ac.in',
      to_name: 'aiDEAS PVGCOET',
      recipient_email: 'aideas@pvgcoet.ac.in',
      from_name: name,
      name: name,
      user_name: name,
      from_email: email,
      email: email,
      user_email: email,
      reply_to: email,
      message: message,
    };

    try {
      const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      if (result.status === 200 || result.text === 'OK') {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully to aideas@pvgcoet.ac.in. We will get back to you soon.',
        });
        form.reset();
      } else {
        throw new Error(result.text || 'Unexpected response status');
      }
    } catch (error) {
      const err = error as { text?: string; message?: string };
      console.error('EmailJS Error:', err?.text || err?.message || error);
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please check your connection or contact us directly at aideas@pvgcoet.ac.in.',
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 7000);
    }
  };

  return (
    <main className="min-h-screen bg-[#06080c] text-white pt-24 lg:pt-28 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
      {/* Deep Dark Navy Atmosphere (Matching Home Page Hero / Ambient Panel) */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 15%, rgba(18, 24, 35, 0.65) 0%, rgba(6, 8, 12, 0.98) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Restrained Cyan & Violet Ambient Gradients */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-75"
        style={{
          backgroundImage: `
            radial-gradient(640px 420px at 14% 18%, rgba(56, 209, 255, 0.08), transparent 65%),
            radial-gradient(640px 420px at 86% 55%, rgba(176, 107, 255, 0.07), transparent 65%),
            radial-gradient(520px 360px at 50% 88%, rgba(42, 93, 255, 0.05), transparent 65%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10 py-1">
        {/* Main Composition: 2-Column on Desktop (lg:grid-cols-12), Single-Column on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center max-w-xl lg:max-w-none mx-auto">
          {/* Left Column — Primary Content & Contact Form */}
          <div className="w-full lg:col-span-7 flex flex-col justify-center relative z-10">
            {/* Uppercase eyebrow with breathing room */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[#38d1ff] text-xs font-mono font-medium tracking-[0.2em] mb-3 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38d1ff] animate-pulse" />
              LET&apos;S CONNECT
            </div>

            {/* Large Prominent Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[52px] font-bold text-white tracking-tight leading-[1.1] mb-3.5 lg:mb-4">
              Contact{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38d1ff] via-[#60a5fa] to-[#b06bff]">
                Us
              </span>
            </h1>

            {/* Introductory Description — BlockTextReveal line-by-line wiper */}
            <BlockTextReveal
              text="Have an idea, a question, or a project in mind? Let's explore what's possible together. Reach out and let's turn your vision into impact."
              textColor="#C7D0DC"
              textShadow="0 0 14px rgba(199, 208, 220, 0.22), 0 0 28px rgba(199, 208, 220, 0.1)"
              blockColor="#0c111d"
              fontSize="17.5px"
              lineHeight="1.75"
              fontWeight={400}
              speed={50}
              className="mb-5 sm:mb-6 max-w-[620px]"
            />

            {/* Status Notifications */}
            {status.type === 'success' && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-fadeIn">
                <FaCheckCircle className="text-emerald-400 text-base shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            {status.type === 'error' && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-fadeIn">
                <FaExclamationCircle className="text-rose-400 text-base shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            {/* Contact Form — BorderGlow glow on desktop, plain card on mobile */}
            {isDesktop ? (
              <BorderGlow
                edgeSensitivity={30}
                glowColor="190 90 70"
                backgroundColor="#0c111d"
                borderRadius={16}
                glowRadius={35}
                glowIntensity={1.0}
                coneSpread={25}
                colors={['#38d1ff', '#b06bff', '#818cf8']}
                innerClassName="p-5 sm:p-6 lg:p-7"
                className="backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_20px_rgba(56,209,255,0.03)] rounded-2xl"
                style={{
                  border: '1px solid rgba(56,209,255,0.2)',
                  transition: 'border-color 0.3s ease',
                }}
              >
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium mb-1.5">
                        Your Name
                      </label>
                      <input
                        id="name"
                        name="Name"
                        type="text"
                        required
                        placeholder="Jane Doe"
                        className="w-full h-[52px] lg:h-[54px] px-4 rounded-xl bg-[#080c16]/85 border border-white/10 text-white placeholder-zinc-500 text-sm sm:text-[15px] focus:outline-none focus:border-[#38d1ff] focus:ring-1 focus:ring-[#38d1ff]/50 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium mb-1.5">
                        Your Email
                      </label>
                      <input
                        id="email"
                        name="Email"
                        type="email"
                        required
                        placeholder="jane@example.com"
                        className="w-full h-[52px] lg:h-[54px] px-4 rounded-xl bg-[#080c16]/85 border border-white/10 text-white placeholder-zinc-500 text-sm sm:text-[15px] focus:outline-none focus:border-[#38d1ff] focus:ring-1 focus:ring-[#38d1ff]/50 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="Message"
                      rows={4}
                      required
                      placeholder="Tell us about your project, idea, or inquiry..."
                      className="w-full h-[125px] lg:h-[135px] min-h-[120px] p-4 rounded-xl bg-[#080c16]/85 border border-white/10 text-white placeholder-zinc-500 text-sm sm:text-[15px] focus:outline-none focus:border-[#38d1ff] focus:ring-1 focus:ring-[#38d1ff]/50 transition-all duration-200 resize-y"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full sm:w-auto h-[54px] lg:h-[56px] inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 rounded-xl font-semibold text-sm sm:text-base tracking-wide transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(56,209,255,0.3)] hover:shadow-[0_0_28px_rgba(176,107,255,0.4)] ${
                        isSubmitting
                          ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-80'
                          : 'bg-gradient-to-r from-[#38d1ff] via-[#5bb4ff] to-[#b06bff] hover:opacity-95 text-[#030712]'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <FaPaperPlane className="text-xs sm:text-sm" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </BorderGlow>
            ) : (
              <div
                className="backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.45)] rounded-2xl p-5"
                style={{
                  backgroundColor: '#0c111d',
                  border: '1px solid rgba(56,209,255,0.18)',
                }}
              >
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium mb-1.5">
                        Your Name
                      </label>
                      <input
                        id="name"
                        name="Name"
                        type="text"
                        required
                        placeholder="Jane Doe"
                        className="w-full h-[52px] lg:h-[54px] px-4 rounded-xl bg-[#080c16]/85 border border-white/10 text-white placeholder-zinc-500 text-sm sm:text-[15px] focus:outline-none focus:border-[#38d1ff] focus:ring-1 focus:ring-[#38d1ff]/50 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium mb-1.5">
                        Your Email
                      </label>
                      <input
                        id="email"
                        name="Email"
                        type="email"
                        required
                        placeholder="jane@example.com"
                        className="w-full h-[52px] lg:h-[54px] px-4 rounded-xl bg-[#080c16]/85 border border-white/10 text-white placeholder-zinc-500 text-sm sm:text-[15px] focus:outline-none focus:border-[#38d1ff] focus:ring-1 focus:ring-[#38d1ff]/50 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="Message"
                      rows={4}
                      required
                      placeholder="Tell us about your project, idea, or inquiry..."
                      className="w-full h-[125px] lg:h-[135px] min-h-[120px] p-4 rounded-xl bg-[#080c16]/85 border border-white/10 text-white placeholder-zinc-500 text-sm sm:text-[15px] focus:outline-none focus:border-[#38d1ff] focus:ring-1 focus:ring-[#38d1ff]/50 transition-all duration-200 resize-y"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full sm:w-auto h-[54px] lg:h-[56px] inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 rounded-xl font-semibold text-sm sm:text-base tracking-wide transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(56,209,255,0.3)] hover:shadow-[0_0_28px_rgba(176,107,255,0.4)] ${
                        isSubmitting
                          ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-80'
                          : 'bg-gradient-to-r from-[#38d1ff] via-[#5bb4ff] to-[#b06bff] hover:opacity-95 text-[#030712]'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <FaPaperPlane className="text-xs sm:text-sm" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Column — Rotating headline + Half-Earth Wireframe visual */}
          <div className="flex flex-col lg:col-span-5 items-center justify-end w-full h-full min-h-[420px] lg:min-h-[500px]">
            <div className="relative w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[480px] xl:max-w-[520px] flex flex-col items-center justify-end h-full">

              {/* Typewriter headline — positioned in the open space immediately above the Earth */}
              <div className="w-full text-center px-1 flex flex-col items-center select-none mb-3 sm:mb-4 lg:mb-5">
                <style>{`
                  @import url('https://fonts.googleapis.com/css2?family=Isometra&display=swap');
                `}</style>

                {/* AIDEAS IS label — matches Hero wordmark branding */}
                <div className="flex items-center justify-center gap-2 mb-2 select-none">
                  <span
                    className="text-[14px] sm:text-[15px] lg:text-[16px] font-normal tracking-[0.06em]"
                    style={{
                      fontFamily: '"Isometra", var(--font-inter, Inter, "Geist", system-ui, sans-serif)',
                      background: 'linear-gradient(90deg, #38d1ff 0%, #60a5fa 50%, #b06bff 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      display: 'inline-block',
                    }}
                  >
                    AIDEAS
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.24em] text-[#94a3b8] uppercase">
                    IS
                  </span>
                </div>

                {/* Animated phrase — enlarged to 28-31px on desktop, matching Hero typography and cyan-blue-violet gradient */}
                <div className="text-[20px] sm:text-[23px] md:text-[26px] lg:text-[28px] xl:text-[31px] font-bold leading-[1.2] tracking-tight">
                  <TypewriterHeadline
                    texts={[
                      'Building Intelligence.',
                      'Building the Future.',
                      'Engineering Possibilities.',
                      'Turning Ideas Into Impact.',
                      'Innovating Beyond Limits.',
                    ]}
                    typeSpeed={50}
                    deleteSpeed={28}
                    pauseMs={1500}
                  />
                </div>
              </div>

              {/* Lower Section: Original clean Half-Earth Wireframe visual */}
              <div className="relative w-full max-w-[480px] lg:max-w-[520px] h-[280px] sm:h-[320px] lg:h-[360px] flex items-end justify-center">
                <GlobeWireframe
                  className="w-full h-full relative z-10"
                  autoRotate
                  autoRotateSpeed={0.28}
                  strokeColor="rgba(255, 255, 255, 0.72)"
                  strokeWidth={0.85}
                  graticuleColor="rgba(255, 255, 255, 0.09)"
                  sphereOutlineColor="rgba(255, 255, 255, 0.35)"
                  tilt={18}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Compact Contact Information Row: Visible on all screens */}
        <div className="mt-6 sm:mt-7 pt-4 sm:pt-5 border-t border-white/[0.08] relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Email */}
            <a
              href="mailto:aideas@pvgcoet.ac.in"
              className="group flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-[#0c111d]/70 backdrop-blur-sm border border-white/[0.08] hover:border-cyan-500/25 hover:bg-[#0f1524]/80 transition-all duration-200"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#38d1ff] shrink-0 group-hover:scale-105 transition-transform">
                <FaEnvelope className="text-xs sm:text-sm" />
              </div>
              <div className="min-w-0">
                <span className="block font-mono text-[10.5px] sm:text-[11px] uppercase tracking-wider text-zinc-400 font-semibold leading-none mb-1.5">
                  Email
                </span>
                <span className="text-xs sm:text-[13.5px] font-medium text-white group-hover:text-[#38d1ff] transition-colors truncate block">
                  aideas@pvgcoet.ac.in
                </span>
              </div>
            </a>

            {/* Campus Location */}
            <a
              href="https://www.google.com/maps/place/PVG'S+College+Of+Engineering,+Technology+And+Management/@18.4899516,73.8498623,935m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bc2c004bc8e1d8f:0x12df641707ea878e!8m2!3d18.4899516!4d73.8524372!16zL20vMGducTZm?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View PVG's COETM location on Google Maps"
              className="group flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-[#0c111d]/70 backdrop-blur-sm border border-white/[0.08] hover:border-cyan-500/25 hover:bg-[#0f1524]/80 transition-all duration-200"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#38d1ff] shrink-0 group-hover:scale-105 transition-transform">
                <FaMapMarkerAlt className="text-xs sm:text-sm" />
              </div>
              <div className="min-w-0">
                <span className="block font-mono text-[10.5px] sm:text-[11px] uppercase tracking-wider text-zinc-400 font-semibold leading-none mb-1.5">
                  Campus Location
                </span>
                <span className="text-xs sm:text-[13.5px] font-medium text-white group-hover:text-[#38d1ff] transition-colors truncate block">
                  PVG&apos;s COETM, Pune, Maharashtra
                </span>
              </div>
            </a>

            {/* Follow Us */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#0c111d]/70 backdrop-blur-sm border border-white/[0.08] flex flex-col justify-center min-h-[72px]">
              <span className="block font-mono text-[10.5px] sm:text-[11px] uppercase tracking-wider text-zinc-400 font-semibold leading-none mb-2">
                Follow Us
              </span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/aideas-pvg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow aIDEAS on LinkedIn"
                  className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080c16]/80 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/[0.08] transition-all duration-200"
                >
                  <div className="w-5 h-5 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#38d1ff] group-hover:scale-110 transition-transform shrink-0">
                    <FaLinkedin className="text-xs" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-medium text-zinc-200 group-hover:text-[#38d1ff] transition-colors">
                    LinkedIn
                  </span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/aideas_pvg/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow aIDEAS on Instagram"
                  className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080c16]/80 border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/[0.08] transition-all duration-200"
                >
                  <div className="w-5 h-5 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#b06bff] group-hover:scale-110 transition-transform shrink-0">
                    <FaInstagram className="text-xs" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-medium text-zinc-200 group-hover:text-[#b06bff] transition-colors">
                    Instagram
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
