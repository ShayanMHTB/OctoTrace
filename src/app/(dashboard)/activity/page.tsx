'use client';

import { Activity, CalendarDays, Flame, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import StatCard from '@/components/blocks/StatCard';
import CommitTrend from '@/components/charts/CommitTrend';
import WeekdayActivity from '@/components/charts/WeekdayActivity';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContributions } from '@/hooks/useGitHub';
import {
  busiestDay,
  streaks,
  weekdayDistribution,
  weeklyTrend,
} from '@/lib/activity-stats';
import { rangeToDays, usePreferences } from '@/lib/preferences';

export default function ActivityPage() {
  const { data, isLoading, error } = useContributions();
  const { dateRange } = usePreferences();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="gap-0 p-5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-3 h-8 w-16" />
            </Card>
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        Couldn’t load your activity data.
      </Card>
    );
  }

  const calendar = data.contributionCalendar;
  const weeksToShow = Math.ceil(rangeToDays(dateRange) / 7);
  const trend = weeklyTrend(calendar).slice(-weeksToShow);
  const weekday = weekdayDistribution(calendar);
  const { current, longest } = streaks(calendar);
  const busiest = busiestDay(calendar);

  const breakdown = [
    { label: 'Commits', value: data.totalCommitContributions, color: 'var(--brand-1)' },
    { label: 'Pull requests', value: data.totalPullRequestContributions, color: 'var(--brand-2)' },
    { label: 'Issues', value: data.totalIssueContributions, color: 'var(--brand-3)' },
    { label: 'Reviews', value: data.totalPullRequestReviewContributions, color: 'var(--muted-foreground)' },
  ];
  const breakdownMax = Math.max(1, ...breakdown.map((b) => b.value));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground">
          Your contribution patterns over the last year.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total contributions"
          value={calendar.totalContributions}
          icon={Activity}
          hint="last year"
        />
        <StatCard
          label="Current streak"
          value={`${current} days`}
          icon={Flame}
        />
        <StatCard
          label="Longest streak"
          value={`${longest} days`}
          icon={Trophy}
        />
        <StatCard
          label="Busiest day"
          value={busiest.count}
          icon={CalendarDays}
          hint={
            busiest.date
              ? format(new Date(busiest.date), 'MMM d, yyyy')
              : undefined
          }
        />
      </div>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Weekly contributions</h3>
        <CommitTrend data={trend} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Most active days</h3>
          <WeekdayActivity data={weekday} />
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Contribution breakdown</h3>
          <ul className="space-y-4">
            {breakdown.map((item) => (
              <li key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {item.value.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.value / breakdownMax) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
