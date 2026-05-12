'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Github, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeToggle } from '../shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const NAV = [
  { title: 'Home', href: '/' },
  { title: 'Features', href: '/#features' },
  { title: 'About', href: '/about' },
  { title: 'FAQ', href: '/faq' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  const ctaHref = isAuthenticated ? '/dashboard' : '/auth';
  const ctaLabel = isAuthenticated ? 'Dashboard' : 'Get Started';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="sticky top-0 z-50 w-full"
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300',
          scrolled
            ? 'my-2 h-14 rounded-full border bg-background/70 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'
            : 'h-16 border-transparent',
        )}
      >
        <Link
          href="/"
          className="group flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-foreground text-background transition-transform group-hover:scale-105">
            <Github className="size-4.5" />
          </span>
          <span>OctoTrace</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="hidden rounded-full sm:inline-flex">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Github className="size-5" />
                  OctoTrace
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-4">
                {NAV.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button asChild className="mt-3 w-full rounded-full">
                    <Link href={ctaHref}>{ctaLabel}</Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
