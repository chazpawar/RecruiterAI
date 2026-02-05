'use client';

import HeroSection from '@/components/landing/HeroSection';
import Features from '@/components/landing/Features';
import About from '@/components/landing/About';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <Features />
      <About />
      <Footer />
    </div>
  );
}
