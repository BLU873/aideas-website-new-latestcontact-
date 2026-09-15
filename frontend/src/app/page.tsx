import Hero from "@/components/Hero";
import ZigzagSection from "@/components/home/ZigzagSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import AboutOverviewSection from "@/components/home/AboutOverviewSection";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-[#10131a] text-white">
      <Hero />
      <ZigzagSection />
      <StatsSection />
      <TestimonialsSection />
      <AboutOverviewSection />
    </main>
  );
}
