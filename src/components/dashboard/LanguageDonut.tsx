'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { LanguageBytes } from '@/hooks/useGitHub';
import { languageColor } from '@/lib/language-colors';
import { formatBytes } from '@/utils/numbers';

type Slice = { name: string; value: number; color: string };

function DonutTooltip({
  active,
  payload,
  totalBytes,
}: {
  active?: boolean;
  payload?: { payload: Slice }[];
  totalBytes: number;
}) {
  if (!active || !payload?.length) return null;
  const slice = payload[0].payload;
  const percent = ((slice.value / totalBytes) * 100).toFixed(1);
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <div className="flex items-center gap-2 font-medium">
        <span
          className="size-2.5 rounded-full"
          style={{ backgroundColor: slice.color }}
        />
        {slice.name}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">
        {formatBytes(slice.value)} · {percent}%
      </div>
    </div>
  );
}

export default function LanguageDonut({
  languages,
}: {
  languages: LanguageBytes[];
}) {
  const TOP = 8;
  const top = languages.slice(0, TOP);
  const restBytes = languages.slice(TOP).reduce((a, l) => a + l.bytes, 0);
  const totalBytes = languages.reduce((a, l) => a + l.bytes, 0) || 1;

  const data: Slice[] = [
    ...top.map((l) => ({
      name: l.name,
      value: l.bytes,
      color: languageColor(l.name),
    })),
    ...(restBytes > 0
      ? [{ name: 'Other', value: restBytes, color: 'var(--muted-foreground)' }]
      : []),
  ];

  return (
    <div className="relative h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="92%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip totalBytes={totalBytes} />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{languages.length}</span>
        <span className="text-xs text-muted-foreground">languages</span>
      </div>
    </div>
  );
}
