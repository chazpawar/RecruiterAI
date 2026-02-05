'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HeroHeader } from '@/components/landing/HeroHeader';

// Pain point bubbles data - positioned around central headline
const painPointBubbles = [
  {
    name: "Sarah K.",
    role: "Founder at TechStart",
    text: "Candidates wait 3 weeks for replies while I'm juggling everything. We're losing great talent to competitors.",
    position: { top: '18%', left: '5%' }, // Top-Left
    delay: 0.8,
    floatDuration: 4.5,
  },
  {
    name: "Rahul M.",
    role: "Hiring Manager at GrowthCo",
    text: "Posted on LinkedIn. Got 200 applications. Skimmed through 20. Hired on gut feeling. They quit in 2 months.",
    position: { top: '18%', right: '5%' }, // Top-Right
    delay: 1.0,
    floatDuration: 5,
  },
  {
    name: "Priya S.",
    role: "CEO at InnovateLabs",
    text: "I'm the CEO, product lead, AND now doing HR? There's zero time to read 200 resumes properly.",
    position: { top: '52%', left: '3%' }, // Bottom-Left
    delay: 1.2,
    floatDuration: 4.2,
  },
  {
    name: "Amit T.",
    role: "Head of HR at ScaleUp",
    text: "Our best candidate accepted another offer while we were still scheduling interviews. This keeps happening.",
    position: { top: '52%', right: '3%' }, // Bottom-Right
    delay: 1.4,
    floatDuration: 4.8,
  },
];

// Floating bubble component
const PainPointBubble = ({
  name,
  text,
  role,
  position,
  delay,
  floatDuration = 4,
}: {
  name: string;
  text: string;
  role: string;
  position: { top?: string; left?: string; right?: string; bottom?: string };
  delay: number;
  floatDuration?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.4, 0.55, 1.4],
      }}
      className="absolute hidden lg:block z-10"
      style={position}
    >
      <div
        className="max-w-[280px] bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl border border-gray-200/60 animate-float"
        style={{
          animationDuration: `${floatDuration}s`,
          animationDelay: `${delay}s`,
        }}
      >
        <p className="text-sm text-gray-700 leading-relaxed italic">&ldquo;{text}&rdquo;</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900">{name}</p>
            <p className="text-[11px] text-gray-500">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface TextEffectProps {
  children: ReactNode;
  preset?: 'fade-in' | 'fade-in-blur';
  per?: 'word' | 'line';
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  speedSegment?: number;
  delay?: number;
}

const TextEffect = ({
  children,
  preset = 'fade-in',
  per = 'word',
  as: Component = 'div',
  className = '',
  speedSegment = 0.1,
  delay = 0,
}: TextEffectProps) => {
  const variants = {
    'fade-in': {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    'fade-in-blur': {
      initial: { opacity: 0, filter: 'blur(12px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
    },
  };

  const currentVariants = variants[preset] || variants['fade-in'];

  if (per === 'line') {
    const lines =
      typeof children === 'string' ? children.split('\n') : [children];
    return (
      <div className={className}>
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={currentVariants.initial}
            animate={currentVariants.animate}
            transition={{
              duration: 0.8,
              delay: delay + index * speedSegment,
              ease: [0.25, 0.4, 0.55, 1.4],
            }}
          >
            {line}
          </motion.div>
        ))}
      </div>
    );
  }

  // Map to specific motion components
  const MotionComponents = {
    div: motion.div,
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    p: motion.p,
    span: motion.span,
  };

  const MotionComponent = MotionComponents[Component] || motion.div;

  return (
    <MotionComponent
      initial={currentVariants.initial}
      animate={currentVariants.animate}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.4, 0.55, 1.4],
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnimationVariants = Record<string, any>;

interface AnimatedGroupProps {
  children: ReactNode;
  variants: AnimationVariants;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedGroup = ({
  children,
  variants,
  className = '',
  style,
}: AnimatedGroupProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={className}
      style={style}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={variants.item || variants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

const transitionVariants: AnimationVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        
        {/* Pain Point Bubbles */}
        {painPointBubbles.map((bubble, index) => (
          <PainPointBubble
            key={index}
            name={bubble.name}
            text={bubble.text}
            role={bubble.role}
            position={bubble.position}
            delay={bubble.delay}
            floatDuration={bubble.floatDuration}
          />
        ))}
        
        <section id="hero">
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: 'spring',
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="absolute inset-0 top-56 -z-20 lg:top-32"
              style={{
                maskImage:
                  'linear-gradient(to bottom, black 35%, transparent 90%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, black 35%, transparent 90%)',
              }}
            >
              <div className="hidden size-full dark:block bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />
            </AnimatedGroup>

            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="/dashboard"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                  >
                    <span className="text-foreground text-sm">
                      AI-Powered Recruiting Platform
                    </span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mx-auto mt-8 max-w-4xl text-balance text-5xl font-bold max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                >
                  Every Hire, Faster and Better
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg text-gray-600"
                >
                  Stop losing great candidates to slow, manual hiring processes. Let AI handle the heavy lifting while you focus on building your team.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-3 md:flex-row"
                >
                  <Button
                    key={1}
                    asChild
                    size="lg"
                    className="rounded-xl px-6 text-base bg-blue-600 hover:bg-blue-700"
                  >
                    <Link href="/dashboard">
                      <span className="text-nowrap">Start Hiring Smarter</span>
                    </Link>
                  </Button>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-xl px-6 text-base border-2"
                  >
                    <Link href="#how-it-works">
                      <span className="text-nowrap">See How It Works</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div
                className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20"
                style={{
                  maskImage:
                    'linear-gradient(to bottom, black 55%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, black 55%, transparent 100%)',
                }}
              >
                <div
                  className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1 ring-background bg-background"
                  style={{
                    boxShadow:
                      'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <Image
                    className="aspect-[15/8] relative rounded-2xl object-cover"
                    src="/hero.png"
                    alt="RecruiterAI Dashboard"
                    width={1500}
                    height={800}
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
}
