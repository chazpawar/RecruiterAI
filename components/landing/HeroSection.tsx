'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroHeader } from '@/components/landing/HeroHeader';
import { DashboardMockup } from '@/components/landing/DashboardMockup';

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="bg-background">
        <section id="hero" className="pt-16 pb-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Announcement Badge */}
            <div className="flex justify-center mb-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                <span>Streamline Your Hiring Process</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Main Headline */}
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.1]">
                Streamline Your
                <br />
                Hiring Process
                <br />
                with TalentFlow
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
                Manage jobs, candidates, and assessments all in one place.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-lg px-8 bg-[#1a1a2e] hover:bg-[#2a2a3e] text-white"
                >
                  <Link href="/dashboard">Start Hiring</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="rounded-lg px-8 text-muted-foreground hover:text-foreground"
                >
                  <Link href="/dashboard">Schedule Demo</Link>
                </Button>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="mt-16 lg:mt-20">
              <div className="relative mx-auto max-w-5xl">
                <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/10 overflow-hidden">
                  <DashboardMockup />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
