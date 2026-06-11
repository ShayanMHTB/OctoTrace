import { get, set } from 'idb-keyval';

/**
 * A daily point-in-time capture of key metrics, stored in IndexedDB. GitHub
 * keeps no history of these, so this is how OctoTrace builds real trends —
 * entirely locally. One record per calendar day; fields merge as different
 * pages contribute what they have.
 */
export interface Snapshot {
  date: string; // YYYY-MM-DD
  stars?: number;
  followers?: number;
  following?: number;
  repos?: number;
  contributions?: number;
  languages?: Record<string, number>; // bytes per language
}

const KEY = 'octotrace.snapshots';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getSnapshots(): Promise<Snapshot[]> {
  return (await get<Snapshot[]>(KEY)) ?? [];
}

/** Merge metrics into today's snapshot (creating it if needed). */
export async function captureSnapshot(
  metrics: Omit<Partial<Snapshot>, 'date'>,
): Promise<void> {
  const all = await getSnapshots();
  const date = today();
  const idx = all.findIndex((s) => s.date === date);
  if (idx >= 0) all[idx] = { ...all[idx], ...metrics };
  else all.push({ date, ...metrics });
  all.sort((a, b) => a.date.localeCompare(b.date));
  await set(KEY, all);
}

export async function clearSnapshots(): Promise<void> {
  await set(KEY, []);
}
