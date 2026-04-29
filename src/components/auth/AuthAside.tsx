'use client';

import { Github, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import ContributionGraph from '@/components/shared/ContributionGraph';
import { fadeUpItem, staggerContainer } from '@/lib/motion';

const POINTS = [
  { icon: ShieldCheck, text: 'Your data never leaves your browser' },
  { icon: Zap, text: 'Live insights straight from the GitHub API' },
];

export default function AuthAside() {
  return (
    <div className="relative hidden overflow-hidden bg-foreground text-background lg:block">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div
        className="animate-float pointer-events-none absolute -left-32 top-1/3 size-[28rem] rounded-full opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--brand-1), transparent 60%)',
        }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative flex h-full flex-col justify-between p-12"
      >
        <motion.div variants={fadeUpItem} className="flex items-center gap-2 text-lg font-bold">
          <span className="grid size-8 place-items-center rounded-lg bg-background text-foreground">
            <Github className="size-4.5" />
          </span>
          OctoTrace
        </motion.div>

        <div className="space-y-8">
          <motion.h2
            variants={fadeUpItem}
            className="max-w-md text-balance text-4xl font-bold tracking-tight"
          >
            Your GitHub story, told beautifully.
          </motion.h2>

          <motion.div variants={fadeUpItem} className="overflow-hidden">
            <ContributionGraph weeks={20} cell="size-3.5" />
          </motion.div>

          <motion.ul variants={fadeUpItem} className="space-y-3">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-background/80">
                <span className="grid size-7 place-items-center rounded-full bg-background/10">
                  <p.icon className="size-4 text-[var(--brand-1)]" />
                </span>
                {p.text}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.p variants={fadeUpItem} className="text-sm text-background/50">
          No tracking · No database · Stored nowhere
        </motion.p>
      </motion.div>
    </div>
  );
}
