'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HeroHeader } from '@/components/landing/HeroHeader';

// Pain point bubbles data
const painPointBubbles = [
  {
    text: "We've been searching for a senior dev for 3 months...",
    role: "Startup Founder",
    position: { top: '15%', left: '3%' },
    delay: 1.2,
    floatDuration: 4,
  },
  {
    text: "Screening 200+ resumes weekly is exhausting",
    role: "HR Manager",
    position: { top: '25%', right: '5%' },
    delay: 1.5,
    floatDuration: 4.5,
  },
  {
    text: "Our best candidates keep dropping off mid-process",
    role: "Talent Lead",
    position: { top: '45%', left: '2%' },
    delay: 1.8,
    floatDuration: 5,
  },
  {
    text: "How do we assess cultural fit remotely?",
    role: "CEO",
    position: { top: '55%', right: '3%' },
    delay: 2.1,
    floatDuration: 4.2,
  },
  {
    text: "Coordinating interviews across timezones is a nightmare",
    role: "Recruiter",
    position: { top: '70%', left: '8%' },
    delay: 2.4,
    floatDuration: 4.8,
  },
  {
    text: "We lost a great hire because we moved too slow",
    role: "Engineering Manager",
    position: { top: '38%', right: '8%' },
    delay: 2.7,
    floatDuration: 5.2,
  },
];

// Floating bubble component
const PainPointBubble = ({
  text,
  role,
  position,
  delay,
  floatDuration = 4,
}: {
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
        className="max-w-[200px] bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-100 animate-float"
        style={{
          animationDuration: `${floatDuration}s`,
          animationDelay: `${delay}s`,
        }}
      >
        <p className="text-xs text-gray-700 leading-relaxed">&ldquo;{text}&rdquo;</p>
        <p className="text-[10px] text-gray-400 mt-1.5 font-medium">— {role}</p>
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
            text={bubble.text}
            role={bubble.role}
            position={bubble.position}
            delay={bubble.delay}
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
                      Streamline Your Hiring Process
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
                  className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                >
                  Streamline Your Hiring Process with RecruiterAI
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg"
                >
                  Manage jobs, candidates, and assessments all in one place.
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
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <Button
                    key={1}
                    asChild
                    size="lg"
                    className="rounded-xl px-5 text-base"
                  >
                    <Link href="/dashboard">
                      <span className="text-nowrap">Start Hiring</span>
                    </Link>
                  </Button>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="rounded-xl px-5"
                  >
                    <Link href="/dashboard">
                      <span className="text-nowrap">Schedule Demo</span>
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
