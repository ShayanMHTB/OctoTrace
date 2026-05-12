'use client';

import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';
import { Reveal } from '@/components/shared/Reveal';
import { Button } from '@/components/ui/button';

export default function CTA() {
  return (
    <section className="px-6 pb-32">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-20 text-center">
          <div className="bg-grid mask-radial-faded pointer-events-none absolute inset-0 opacity-60" />
          <div
            className="pointer-events-none absolute -bottom-24 left-1/2 size-[30rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
            style={{
              background: 'radial-gradient(circle, var(--brand-1), transparent 60%)',
            }}
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to trace your{' '}
              <span className="text-gradient">GitHub story</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
              Connect your account and explore analytics that respect your
              privacy by default.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand group mt-9 h-12 rounded-full px-8 text-base text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <Link href="/auth">
                <Github className="size-4.5" />
                Connect GitHub
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
