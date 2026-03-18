import DJHeroSection from "@/components/hero";
import DJAppFeatures from "@/components/features";
import CTASection from "@/components/cta";
import Footer from "@/components/footer";
import InteractiveBackground from "@/components/interactive-background";

export default function Home() {
  return (
    <main className="min-h-screen bg-black dark relative">
      <InteractiveBackground />
      <div className="relative z-10">
        <DJHeroSection />
        <DJAppFeatures />
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
