'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE, fadeUpItem, staggerContainer } from '@/lib/motion';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay in seconds. */
  delay?: number;
  /** Vertical offset to rise from. */
  y?: number;
  once?: boolean;
};

/**
 * Fades + rises its children when scrolled into view. Respects
 * prefers-reduced-motion (renders statically). The workhorse for the site.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  once?: boolean;
};

/** Container that staggers children marked with <StaggerItem>. */
export function Stagger({ children, className, once = true }: StaggerProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
};

export function StaggerItem({
  children,
  className,
  variants = fadeUpItem,
}: StaggerItemProps) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
