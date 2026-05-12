'use client';

import Link from 'next/link';
import { ArrowRight, Github, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import ContributionGraph from '@/components/shared/ContributionGraph';
import { fadeUpItem, staggerContainer } from '@/lib/motion';

const STATS = [
  { value: '100%', label: 'In your browser' },
  { value: '0', label: 'Servers storing data' },
  { value: '5k/hr', label: 'GitHub API headroom' },
];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="bg-grid mask-radial-faded pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div
        className="animate-float pointer-events-none absolute -top-40 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, var(--brand-1), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute -right-40 top-40 -z-10 size-[30rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, var(--brand-3), transparent 60%)',
        }}
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-32 text-center sm:pt-40">
        <motion.div
          variants={staggerContainer}
          initial={reduce ? false : 'hidden'}
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeUpItem}>
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
              <Sparkles className="size-3.5 text-[var(--brand-1)]" />
              Privacy-first GitHub analytics
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUpItem}
            className="mt-6 max-w-4xl text-balance text-5xl font-bold tracking-tight sm:text-7xl"
          >
            See your GitHub like{' '}
            <span className="text-gradient">never before</span>
          </motion.h1>

          <motion.p
            variants={fadeUpItem}
            className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
          >
            OctoTrace turns your commits, repositories, and languages into
            beautiful, actionable insight — fetched live from GitHub, processed
            entirely in your browser, and stored absolutely nowhere.
          </motion.p>

          <motion.div
            variants={fadeUpItem}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="bg-brand group h-12 rounded-full px-7 text-base text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <Link href="/auth">
                <Github className="size-4.5" />
                Connect GitHub
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full px-7 text-base"
            >
              <Link href="/#features">Explore features</Link>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUpItem}
            className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <ShieldCheck className="size-3.5 text-[var(--brand-1)]" />
            No tracking. No database. Revoke access anytime.
          </motion.p>
        </motion.div>

        {/* Floating showcase card */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="glow mt-16 w-full max-w-3xl rounded-2xl border bg-card/70 p-6 text-left backdrop-blur"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="grid size-6 place-items-center rounded-md bg-foreground text-background">
                <Github className="size-3.5" />
              </span>
              Contribution activity
            </div>
            <span className="text-xs text-muted-foreground">last 24 weeks</span>
          </div>
          <div className="overflow-hidden">
            <ContributionGraph weeks={24} cell="size-3 sm:size-3.5" interactive />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4 border-t pt-5">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-xl font-bold sm:text-2xl">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
