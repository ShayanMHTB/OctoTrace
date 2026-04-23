'use client';

import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/** Deterministic 0–4 intensity so SSR and client render identically. */
function level(c: number, r: number) {
  const n = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
  return Math.floor((n - Math.floor(n)) * 5);
}

const LEVEL_BG = [
  'color-mix(in oklch, var(--muted-foreground) 16%, transparent)',
  'color-mix(in oklch, var(--brand-1) 32%, transparent)',
  'color-mix(in oklch, var(--brand-1) 56%, transparent)',
  'color-mix(in oklch, var(--brand-1) 80%, transparent)',
  'var(--brand-1)',
];

type Props = {
  weeks?: number;
  className?: string;
  /** Tailwind size class for each cell, e.g. "size-3". */
  cell?: string;
  interactive?: boolean;
};

/** An animated GitHub-style contribution heatmap — the site's signature motif. */
export default function ContributionGraph({
  weeks = 24,
  className,
  cell = 'size-3',
  interactive = false,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <div className={cn('flex gap-1', className)}>
      {Array.from({ length: weeks }).map((_, c) => (
        <div key={c} className="flex flex-col gap-1">
          {Array.from({ length: 7 }).map((__, r) => (
            <motion.div
              key={r}
              className={cn('rounded-[3px]', cell)}
              style={{ backgroundColor: LEVEL_BG[level(c, r)] }}
              initial={reduce ? false : { opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: reduce ? 0 : c * 0.012 + r * 0.012,
              }}
              {...(interactive
                ? { whileHover: { scale: 1.3, transition: { duration: 0.1 } } }
                : {})}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
