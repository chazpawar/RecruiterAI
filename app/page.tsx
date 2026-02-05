'use client';

import HeroSection from '@/components/landing/HeroSection';
import Features from '@/components/landing/Features';
import AutomationFlows from '@/components/landing/AutomationFlows';
import HireFromAnywhere from '@/components/landing/HireFromAnywhere';
import About from '@/components/landing/About';
import Testimonials from '@/components/landing/Testimonials';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <Features />
      <AutomationFlows />
      <HireFromAnywhere />
      <About />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
