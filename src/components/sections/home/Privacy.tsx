'use client';

import { Check, Lock } from 'lucide-react';
import { Reveal } from '@/components/shared/Reveal';

const POINTS = [
  'No backend and no database — there’s nothing to breach.',
  'Your GitHub token is stored only in your browser’s localStorage.',
  'All analytics are fetched live and processed client-side.',
  'Revoke access anytime from your GitHub settings.',
];

export default function Privacy() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--brand-1)]">
            Privacy by design
          </p>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Your data never leaves your machine
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Most analytics tools copy your data onto their servers. OctoTrace
            doesn’t have servers to copy it to. Everything happens in the tab
            you’re looking at.
          </p>
          <ul className="mt-8 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--brand-1)]/15 text-[var(--brand-1)]">
                  <Check className="size-3.5" />
                </span>
                <span className="text-sm text-foreground/90">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glow relative mx-auto flex aspect-square w-full max-w-md items-center justify-center rounded-3xl border bg-card">
            <div className="bg-grid mask-radial-faded absolute inset-0 rounded-3xl opacity-60" />
            <div className="relative flex flex-col items-center gap-4 text-center">
              <div className="bg-brand grid size-20 place-items-center rounded-3xl text-white shadow-lg">
                <Lock className="size-9" />
              </div>
              <p className="text-2xl font-bold">Stored nowhere</p>
              <p className="max-w-[14rem] text-sm text-muted-foreground">
                The most private analytics are the ones that keep no record of
                you.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
