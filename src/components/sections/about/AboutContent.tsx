'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Eye,
  Heart,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/shared/Reveal';
import { Button } from '@/components/ui/button';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Privacy first',
    description:
      'We built OctoTrace without a backend on purpose. If we can’t collect your data, we can never misuse it.',
  },
  {
    icon: Eye,
    title: 'Radical transparency',
    description:
      'Every byte is fetched in front of you, from GitHub, in your browser. No black boxes, no hidden pipelines.',
  },
  {
    icon: Heart,
    title: 'Crafted, not generated',
    description:
      'Thoughtful motion, considered typography, and visualizations designed to be genuinely enjoyable to use.',
  },
  {
    icon: KeyRound,
    title: 'You stay in control',
    description:
      'Your access token lives only in your browser, and you can revoke it from GitHub at any moment.',
  },
];

const STACK = [
  'Next.js 15',
  'React 19',
  'TypeScript',
  'Tailwind CSS v4',
  'Radix UI',
  'Recharts',
  'Motion',
  'GitHub REST API',
];

export default function AboutContent() {
  return (
    <>
      {/* Intro */}
      <section className="relative overflow-hidden">
        <div className="bg-grid mask-radial-faded pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-32 text-center sm:pt-40">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
              About OctoTrace
            </span>
            <h1 className="mt-6 text-balance text-5xl font-bold tracking-tight sm:text-6xl">
              Analytics that{' '}
              <span className="text-gradient">respect you</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
              OctoTrace exists to prove a point: you can have deep, beautiful
              insight into your developer life without handing your data to
              anyone.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight">Why we built it</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-4 text-muted-foreground">
            <p>
              GitHub holds a rich story about how you build — the rhythms of your
              commits, the languages you reach for, the projects you nurture. But
              its native interface only scratches the surface.
            </p>
            <p>
              Most tools that go deeper come with a catch: they copy your data
              onto their servers. OctoTrace takes a different path. There is no
              server, no database, and nothing to leak — just your browser
              talking directly to GitHub.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-t bg-muted/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--brand-1)]">
              Our principles
            </p>
            <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight">
              What we optimize for
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <StaggerItem key={v.title}>
                <div className="h-full rounded-2xl border bg-card p-6 transition-colors hover:border-[var(--brand-1)]/40">
                  <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl border bg-background text-[var(--brand-1)]">
                    <v.icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{v.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {v.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Stack */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight">Built on solid ground</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              A modern, fully client-side stack chosen for speed, accessibility,
              and craftsmanship.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 flex flex-wrap justify-center gap-3">
            {STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-full border bg-card px-4 py-2 text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32">
        <Reveal className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center">
            <div className="bg-grid mask-radial-faded pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                See it for yourself
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Connect your GitHub account and explore your analytics in
                seconds.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-brand group mt-8 h-12 rounded-full px-8 text-base text-white shadow-lg"
              >
                <Link href="/auth">
                  Get started
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
