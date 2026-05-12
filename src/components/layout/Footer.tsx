import Link from 'next/link';
import { Github } from 'lucide-react';

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Get Started', href: '/auth' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'GitHub REST API', href: 'https://docs.github.com/en/rest' },
      { label: 'Source', href: 'https://github.com' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t bg-muted/30">
      <div className="bg-grid mask-radial-faded pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="grid size-8 place-items-center rounded-lg bg-foreground text-background">
                <Github className="size-4.5" />
              </span>
              OctoTrace
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              Privacy-first GitHub analytics. Your data is fetched live in your
              browser and never stored on a server.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading} className="space-y-3">
              <h3 className="text-sm font-semibold">{col.heading}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => {
                  const external = link.href.startsWith('http');
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        {...(external
                          ? { target: '_blank', rel: 'noreferrer' }
                          : {})}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} OctoTrace. All rights reserved.</p>
          <p>Built with Next.js · Fetched from GitHub · Stored nowhere.</p>
        </div>
      </div>
    </footer>
  );
}
