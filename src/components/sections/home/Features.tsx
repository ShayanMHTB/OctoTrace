'use client';

import {
  Activity,
  BarChart3,
  GitBranch,
  Languages,
  RefreshCw,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Reveal, Stagger, StaggerItem } from '@/components/shared/Reveal';
import ContributionGraph from '@/components/shared/ContributionGraph';
import { cn } from '@/lib/utils';

/** Small animated bar chart used inside the featured card. */
function BarsVisual() {
  const reduce = useReducedMotion();
  const bars = [45, 70, 35, 90, 60, 80, 50, 75, 40, 95, 65, 55];
  return (
    <div className="mt-6 flex h-28 items-end gap-1.5">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="bg-brand flex-1 rounded-t-sm opacity-80"
          style={{ originY: 1 }}
          initial={reduce ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.04, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div style={{ height: `${h}px` }} />
        </motion.div>
      ))}
    </div>
  );
}

function CardShell({
  icon: Icon,
  title,
  description,
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-card p-6 transition-colors hover:border-[var(--brand-1)]/40',
        className,
      )}
    >
      <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl border bg-background text-[var(--brand-1)]">
        <Icon className="size-5" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--brand-1)]">
            Features
          </p>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Everything GitHub doesn’t show you
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Deep, beautiful analytics across your repositories, languages, and
            activity — without giving up a shred of privacy.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
          <StaggerItem className="md:col-span-4">
            <CardShell
              icon={GitBranch}
              title="Repository analytics"
              description="Stars, forks, issues, and growth across every repo you own — ranked, searchable, and visualized at a glance."
              className="h-full"
            >
              <BarsVisual />
            </CardShell>
          </StaggerItem>

          <StaggerItem className="md:col-span-2">
            <CardShell
              icon={ShieldCheck}
              title="Privacy-first"
              description="No backend, no database. Your data never leaves your browser."
              className="h-full bg-gradient-to-b from-card to-[var(--brand-1)]/5"
            />
          </StaggerItem>

          <StaggerItem className="md:col-span-2">
            <CardShell
              icon={Languages}
              title="Language breakdown"
              description="Understand your true tech stack with per-language proportions and trends over time."
              className="h-full"
            />
          </StaggerItem>

          <StaggerItem className="md:col-span-2">
            <CardShell
              icon={RefreshCw}
              title="Always live"
              description="Fetched straight from the GitHub API in real time — never stale, never cached on a server."
              className="h-full"
            />
          </StaggerItem>

          <StaggerItem className="md:col-span-2">
            <CardShell
              icon={Activity}
              title="Commit activity"
              description="A familiar contribution heatmap, supercharged."
              className="h-full"
            >
              <div className="mt-5 overflow-hidden">
                <ContributionGraph weeks={12} cell="size-2.5" />
              </div>
            </CardShell>
          </StaggerItem>

          <StaggerItem className="md:col-span-6">
            <CardShell
              icon={BarChart3}
              title="Beautiful, theme-aware charts"
              description="Every visualization is crafted for clarity and adapts seamlessly to light and dark mode — built on Recharts, designed to be screenshot-worthy."
              className="flex flex-col justify-between md:flex-row md:items-center"
            >
              <div className="mt-6 flex gap-6 md:mt-0">
                {['Trends', 'Pie', 'Heatmap', 'Tables'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </CardShell>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
