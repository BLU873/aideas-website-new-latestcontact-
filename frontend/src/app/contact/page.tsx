'use client';

import { useState } from 'react';
import { FaLinkedin, FaInstagram} from 'react-icons/fa';

export default function ContactPage() {
  const [showMsg, setShowMsg] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowMsg(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("Name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("Email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("Message") as HTMLTextAreaElement).value;

    const mailtoLink = `mailto:aideas@pvgcoet.ac.in?subject=Message from ${name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0AMessage: ${message}`;

    setTimeout(() => {
      window.location.href = mailtoLink;
      setIsSubmitting(false);
    }, 1000);

    setTimeout(() => setShowMsg(false), 5000);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-500 mb-4">Contact Us</h1>
        <p className="text-gray-300 mb-12">
          Have a question, suggestion, or want to collaborate? Reach out to us through the form below or connect on social media.
        </p>

        {showMsg && (
          <div className="mb-6 p-3 rounded-lg bg-green-700 text-green-100 font-semibold animate-fadeIn">
            ✅ Your email app is opening. Please send the message.
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 text-left">
          <div>
            <label htmlFor="name" className="block mb-2 font-medium">Name</label>
            <input
              id="name"
              name="Name"
              type="text"
              required
              className="w-full px-4 py-2 bg-zinc-800 text-white border border-zinc-600 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform focus:scale-[1.01]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-medium">Email</label>
            <input
              id="email"
              name="Email"
              type="email"
              required
              className="w-full px-4 py-2 bg-zinc-800 text-white border border-zinc-600 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform focus:scale-[1.01]"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 font-medium">Message</label>
            <textarea
              id="message"
              name="Message"
              rows={5}
              required
              className="w-full px-4 py-2 bg-zinc-800 text-white border border-zinc-600 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform focus:scale-[1.01]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all w-full md:w-fit mx-auto flex items-center justify-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </button>
        </form>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-10 text-2xl text-gray-400">
          {[
            { href: "https://www.linkedin.com/company/aideas-pvg", icon: <FaLinkedin /> },
            { href: "https://www.instagram.com/aideas_pvg/?hl=en", icon: <FaInstagram /> },
            
            
          ].map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:scale-110 transition-transform duration-200"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
