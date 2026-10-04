'use client';

import dynamic from 'next/dynamic';

const AideasNetwork = dynamic(() => import('@/components/AideasNetwork/AideasNetwork'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#020f1c]">
      <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Loading Network Canvas...</span>
    </div>
  ),
});

export default function MembersPage() {
  return (
    <main className="min-h-screen text-white bg-[#020f1c]">
      <AideasNetwork />
    </main>
  );
}
