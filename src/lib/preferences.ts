'use client';

import { useSyncExternalStore } from 'react';

export type DateRange = '30' | '90' | '365';

export interface Preferences {
  dateRange: DateRange;
}

const DEFAULTS: Preferences = { dateRange: '365' };
const KEY = 'octotrace.preferences';

let cache: Preferences | null = null;
const listeners = new Set<() => void>();

function read(): Preferences {
  if (cache) return cache;
  if (typeof window === 'undefined') return DEFAULTS;
  let value: Preferences;
  try {
    const raw = window.localStorage.getItem(KEY);
    value = raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    value = DEFAULTS;
  }
  cache = value;
  return value;
}

export function setPreference<K extends keyof Preferences>(
  key: K,
  value: Preferences[K],
): void {
  const next = { ...read(), [key]: value };
  cache = next;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }
  listeners.forEach((l) => l());
}

/** App-wide, persisted user preferences. Hydration-safe (SSR → defaults). */
export function usePreferences(): Preferences {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => DEFAULTS,
  );
}

/** Number of days for a date-range value. */
export function rangeToDays(range: DateRange): number {
  return Number(range);
}
