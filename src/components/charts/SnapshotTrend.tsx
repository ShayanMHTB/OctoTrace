'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 };

export interface TrendPoint {
  date: string;
  value: number;
}

function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <div className="font-medium">{payload[0].value.toLocaleString()}</div>
      {label && (
        <div className="text-xs text-muted-foreground">
          {format(new Date(label), 'MMM d, yyyy')}
        </div>
      )}
    </div>
  );
}

export default function SnapshotTrend({
  data,
  color = 'var(--brand-1)',
}: {
  data: TrendPoint[];
  color?: string;
}) {
  const id = `trend-${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => (v ? format(new Date(v), 'MMM d') : '')}
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            width={40}
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
          />
          <Tooltip content={<TrendTooltip />} cursor={{ stroke: 'var(--border)' }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${id})`}
            dot={data.length < 12}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
