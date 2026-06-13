'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker (production only — registering in dev fights
 * Turbopack's HMR). Renders nothing.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  return null;
}
