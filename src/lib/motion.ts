import type { Variants } from 'motion/react';

/** Shared easing — a soft, confident ease-out used across the marketing site. */
export const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/** Container that staggers its children into view. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/** Child item: fade + rise. Pairs with `staggerContainer`. */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Simple fade. */
export const fadeItem: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

/** Scale-in for cards / media. */
export const scaleItem: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};
