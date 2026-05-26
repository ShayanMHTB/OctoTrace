'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WrappedSlide {
  id: string;
  eyebrow?: string;
  value: string;
  caption: string;
  /** CSS color for the slide's ambient glow. */
  accent?: string;
}

export default function WrappedStory({
  slides,
  footer,
}: {
  slides: WrappedSlide[];
  footer?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const last = slides.length - 1;

  const next = useCallback(
    () => setIndex((v) => Math.min(v + 1, last)),
    [last],
  );
  const prev = useCallback(() => setIndex((v) => Math.max(v - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const slide = slides[index];
  const accent = slide.accent ?? 'var(--brand-1)';
  const onLast = index === last;

  return (
    <div className="relative mx-auto flex aspect-[4/5] w-full max-w-md flex-col overflow-hidden rounded-3xl border bg-card sm:aspect-[3/4]">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <motion.div
        key={`glow-${slide.id}`}
        className="pointer-events-none absolute -top-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        style={{
          background: `radial-gradient(circle, ${accent}, transparent 60%)`,
        }}
      />

      {/* Progress dots */}
      <div className="relative z-10 flex gap-1.5 p-4">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              i <= index ? 'bg-foreground' : 'bg-border',
            )}
          />
        ))}
      </div>

      {/* Slide content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col items-center"
          >
            {slide.eyebrow && (
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                {slide.eyebrow}
              </p>
            )}
            <p className="text-balance text-5xl font-bold leading-tight tracking-tight">
              {slide.value}
            </p>
            <p className="mt-4 text-pretty text-muted-foreground">
              {slide.caption}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / controls */}
      <div className="relative z-10 p-4">
        {onLast && footer ? (
          <div className="mb-3">{footer}</div>
        ) : null}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous"
            className="grid size-9 place-items-center rounded-full border transition-colors hover:bg-accent disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-xs text-muted-foreground tabular-nums">
            {index + 1} / {slides.length}
          </span>
          <button
            type="button"
            onClick={next}
            disabled={onLast}
            aria-label="Next"
            className="grid size-9 place-items-center rounded-full border transition-colors hover:bg-accent disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
