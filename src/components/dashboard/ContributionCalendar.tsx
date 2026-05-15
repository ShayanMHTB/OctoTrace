'use client';

import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  useContributionCalendar,
  type ContributionDay,
} from '@/hooks/useGitHub';

const LEVEL_BG = [
  'color-mix(in oklch, var(--muted-foreground) 16%, transparent)',
  'color-mix(in oklch, var(--brand-1) 32%, transparent)',
  'color-mix(in oklch, var(--brand-1) 56%, transparent)',
  'color-mix(in oklch, var(--brand-1) 80%, transparent)',
  'var(--brand-1)',
];

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Map a count to 0–4 relative to the user's busiest day. */
function levelFor(count: number, max: number): number {
  if (count <= 0) return 0;
  if (max <= 0) return 1;
  return Math.min(4, Math.ceil((count / max) * 4));
}

export default function ContributionCalendar() {
  const { data, isLoading, error } = useContributionCalendar();

  if (isLoading) {
    return (
      <Card className="flex h-48 items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="flex h-48 items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Couldn’t load your contribution calendar.
      </Card>
    );
  }

  const max = Math.max(
    1,
    ...data.weeks.flatMap((w) =>
      w.contributionDays.map((d) => d.contributionCount),
    ),
  );

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-semibold">Contribution activity</h3>
        <span className="text-sm text-muted-foreground">
          {data.totalContributions.toLocaleString()} in the last year
        </span>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="inline-flex min-w-full flex-col gap-1">
          {/* Month labels */}
          <div className="flex gap-1 pl-7 text-xs text-muted-foreground">
            {data.weeks.map((week, i) => {
              const first = week.contributionDays[0];
              const month = first ? new Date(first.date).getMonth() : -1;
              const prevFirst = data.weeks[i - 1]?.contributionDays[0];
              const prevMonth = prevFirst
                ? new Date(prevFirst.date).getMonth()
                : -1;
              const showLabel = i === 0 || month !== prevMonth;
              return (
                <div key={i} className="w-3">
                  {showLabel && month >= 0 ? MONTHS[month] : ''}
                </div>
              );
            })}
          </div>

          {/* Day grid: weekday labels + week columns */}
          <div className="flex gap-1">
            <div className="flex flex-col justify-between pr-1 text-xs text-muted-foreground">
              <span className="h-3" />
              <span>Mon</span>
              <span className="h-3" />
              <span>Wed</span>
              <span className="h-3" />
              <span>Fri</span>
              <span className="h-3" />
            </div>

            {data.weeks.map((week, wi) => {
              const slots: (ContributionDay | null)[] = Array(7).fill(null);
              for (const day of week.contributionDays) slots[day.weekday] = day;
              return (
                <div key={wi} className="flex flex-col gap-1">
                  {slots.map((day, di) => (
                    <div
                      key={di}
                      className="size-3 rounded-[3px]"
                      style={{
                        backgroundColor: day
                          ? LEVEL_BG[levelFor(day.contributionCount, max)]
                          : 'transparent',
                      }}
                      title={
                        day
                          ? `${day.contributionCount} contribution${
                              day.contributionCount === 1 ? '' : 's'
                            } on ${day.date}`
                          : undefined
                      }
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <span className="mr-1">Less</span>
        {LEVEL_BG.map((bg, i) => (
          <span
            key={i}
            className="size-3 rounded-[3px]"
            style={{ backgroundColor: bg }}
          />
        ))}
        <span className="ml-1">More</span>
      </div>
    </Card>
  );
}
