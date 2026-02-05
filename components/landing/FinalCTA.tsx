'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FinalCTA() {
  return (
    <section id="final-cta" className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-black">
      <div className="mx-auto max-w-5xl px-6 text-center text-white">
        <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
          Ready to Hire Better, Faster?
        </h2>
        <p className="mt-4 text-lg text-slate-200">
          Join 500+ companies hiring smarter with AI
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-xl px-6 text-base bg-white text-slate-900 hover:bg-slate-100">
            <Link href="/dashboard">Start Free Trial</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl px-6 text-base border-white text-white hover:bg-white/10"
          >
            <Link href="#how-it-works">Schedule Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
