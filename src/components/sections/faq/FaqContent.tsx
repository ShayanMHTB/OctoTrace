'use client';

import Link from 'next/link';
import { Reveal } from '@/components/shared/Reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    q: 'Where is my GitHub data stored?',
    a: 'Nowhere on a server. OctoTrace has no backend and no database. Your data is fetched live from the GitHub API directly in your browser and only held in memory for the session.',
  },
  {
    q: 'Can OctoTrace see my access token?',
    a: 'No. A single stateless serverless function exchanges the OAuth code for a token (because the client secret must stay server-side), and the token is handed straight back to your browser. It is stored only in your browser’s localStorage.',
  },
  {
    q: 'What permissions does it request?',
    a: 'By default OctoTrace requests read access to your profile and email, plus the repo scope so it can analyze private repositories. If you only care about public repos, the scope can be narrowed to public_repo.',
  },
  {
    q: 'Can it access my private repositories?',
    a: 'Only if you grant the repo scope during sign-in. Everything is read-only — OctoTrace never writes to your account.',
  },
  {
    q: 'How do I revoke access?',
    a: 'Log out to clear the token from your browser, and/or revoke OctoTrace entirely from GitHub → Settings → Applications. Because nothing is stored server-side, there is no leftover data to delete.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. The entire experience is responsive and works across phones, tablets, and desktops.',
  },
  {
    q: 'Will my data ever be sold or shared?',
    a: 'It can’t be. There is no server collecting it in the first place — privacy is enforced by the architecture, not just a policy.',
  },
];

export default function FaqContent() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid mask-radial-faded pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div className="mx-auto max-w-3xl px-6 pb-32 pt-32 sm:pt-40">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
            FAQ
          </span>
          <h1 className="mt-6 text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            Questions, <span className="text-gradient">answered</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            Everything you might want to know about how OctoTrace handles your
            data and works under the hood.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.15} className="mt-14 text-center">
          <div className="rounded-2xl border bg-card p-8">
            <h2 className="text-xl font-semibold">Still curious?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              The best way to understand OctoTrace is to try it. Connect your
              GitHub account — it takes seconds, and your data never leaves your
              browser.
            </p>
            <Link
              href="/auth"
              className="bg-brand mt-6 inline-flex h-11 items-center rounded-full px-7 text-sm font-medium text-white shadow-lg"
            >
              Get started
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
