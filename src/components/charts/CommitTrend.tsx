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
import type { WeekPoint } from '@/lib/activity-stats';

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 };

function TrendTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: WeekPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <div className="font-medium">
        {point.total} contribution{point.total === 1 ? '' : 's'}
      </div>
      {point.week && (
        <div className="text-xs text-muted-foreground">
          week of {format(new Date(point.week), 'MMM d, yyyy')}
        </div>
      )}
    </div>
  );
}

export default function CommitTrend({ data }: { data: WeekPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="commitFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-1)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--brand-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="week"
            tickFormatter={(v) => (v ? format(new Date(v), 'MMM') : '')}
            minTickGap={32}
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
          />
          <YAxis
            allowDecimals={false}
            width={36}
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
          />
          <Tooltip
            content={<TrendTooltip />}
            cursor={{ stroke: 'var(--border)' }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="var(--brand-1)"
            strokeWidth={2}
            fill="url(#commitFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
