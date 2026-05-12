'use client';

import { BarChart3, Github, Search } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/shared/Reveal';

const STEPS = [
  {
    icon: Github,
    title: 'Connect GitHub',
    description:
      'Authorize OctoTrace with a single click. The token lives only in your browser — we never see it.',
  },
  {
    icon: BarChart3,
    title: 'We analyze, live',
    description:
      'Your repositories, commits, and languages are fetched straight from the GitHub API and crunched on the spot.',
  },
  {
    icon: Search,
    title: 'Discover insight',
    description:
      'Explore beautiful dashboards that reveal patterns GitHub’s native UI keeps hidden.',
  },
];

export default function HowItWorks() {
  return (
    <section className="border-t bg-muted/20 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--brand-1)]">
            How it works
          </p>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            From login to insight in seconds
          </h2>
        </Reveal>

        <Stagger className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* connecting line */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px md:block"
            style={{
              background:
                'linear-gradient(to right, transparent, var(--border) 15%, var(--border) 85%, transparent)',
            }}
          />
          {STEPS.map((step, i) => (
            <StaggerItem key={step.title} className="relative text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border bg-background text-[var(--brand-1)] shadow-sm">
                <step.icon className="size-6" />
              </div>
              <div className="mx-auto mt-4 flex items-center justify-center gap-2">
                <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                  STEP {i + 1}
                </span>
              </div>
              <h3 className="mt-1 text-xl font-semibold">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                {step.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
