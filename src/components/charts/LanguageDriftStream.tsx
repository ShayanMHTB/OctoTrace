'use client';

import { ResponsiveStream } from '@nivo/stream';
import { format } from 'date-fns';
import type { Snapshot } from '@/lib/snapshots';
import { languageColor } from '@/lib/language-colors';
import { nivoTheme } from '@/lib/nivo-theme';

export default function LanguageDriftStream({
  snapshots,
}: {
  snapshots: Snapshot[];
}) {
  const withLangs = snapshots.filter(
    (s) => s.languages && Object.keys(s.languages).length > 0,
  );

  if (withLangs.length < 2) {
    return (
      <div className="flex h-72 items-center justify-center text-center text-sm text-muted-foreground">
        Language drift appears once you have at least two daily snapshots with
        language data.
      </div>
    );
  }

  // Top languages by total bytes across snapshots.
  const totals = new Map<string, number>();
  for (const s of withLangs) {
    for (const [lang, bytes] of Object.entries(s.languages!)) {
      totals.set(lang, (totals.get(lang) ?? 0) + bytes);
    }
  }
  const keys = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k]) => k);

  const data = withLangs.map((s) => {
    const row: Record<string, number> = {};
    for (const k of keys) row[k] = s.languages?.[k] ?? 0;
    return row;
  });
  const dates = withLangs.map((s) => s.date);

  return (
    <div className="h-72 w-full">
      <ResponsiveStream
        data={data}
        keys={keys}
        theme={nivoTheme}
        margin={{ top: 8, right: 8, bottom: 24, left: 40 }}
        colors={keys.map((k) => languageColor(k))}
        offsetType="silhouette"
        borderColor="var(--background)"
        axisBottom={{
          format: (i: number) =>
            dates[i] ? format(new Date(dates[i]), 'MMM d') : '',
        }}
        axisLeft={null}
        enableGridX={false}
        enableGridY={false}
        animate={false}
      />
    </div>
  );
}
