'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { WeekdayPoint } from '@/lib/activity-stats';

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 };

function WeekdayTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: WeekdayPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <span className="font-medium">{point.day}</span>
      <span className="text-muted-foreground">
        {' '}
        — {point.total.toLocaleString()}
      </span>
    </div>
  );
}

export default function WeekdayActivity({ data }: { data: WeekdayPoint[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
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
            content={<WeekdayTooltip />}
            cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="var(--brand-1)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
