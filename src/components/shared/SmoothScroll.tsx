'use client';

import { ReactLenis } from 'lenis/react';
import type { ReactNode } from 'react';

/**
 * Wraps the app in Lenis for inertial smooth scrolling. Mounted at the root of
 * the public layout. Honors prefers-reduced-motion by letting Lenis fall back
 * to native scrolling for users who request it.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
