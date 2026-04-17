import type { ContributionCalendar } from '@/hooks/useGitHub';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface WeekPoint {
  /** ISO date of the week's first day (used as the X value). */
  week: string;
  total: number;
}

/** Total contributions per calendar week — for the trend chart. */
export function weeklyTrend(cal: ContributionCalendar): WeekPoint[] {
  return cal.weeks.map((w) => ({
    week: w.contributionDays[0]?.date ?? '',
    total: w.contributionDays.reduce((a, d) => a + d.contributionCount, 0),
  }));
}

export interface WeekdayPoint {
  day: string;
  total: number;
}

/** Contributions summed by day-of-week — "when are you most active". */
export function weekdayDistribution(cal: ContributionCalendar): WeekdayPoint[] {
  const totals = Array<number>(7).fill(0);
  for (const w of cal.weeks) {
    for (const d of w.contributionDays) totals[d.weekday] += d.contributionCount;
  }
  return totals.map((total, i) => ({ day: WEEKDAYS[i], total }));
}

/** Current (trailing) and longest contribution streaks, in days. */
export function streaks(cal: ContributionCalendar): {
  current: number;
  longest: number;
} {
  const days = cal.weeks.flatMap((w) => w.contributionDays);
  let longest = 0;
  let run = 0;
  for (const d of days) {
    if (d.contributionCount > 0) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) current++;
    else break;
  }
  return { current, longest };
}

/** The single busiest day in the window. */
export function busiestDay(cal: ContributionCalendar): {
  date: string;
  count: number;
} {
  let best = { date: '', count: 0 };
  for (const w of cal.weeks) {
    for (const d of w.contributionDays) {
      if (d.contributionCount > best.count) {
        best = { date: d.date, count: d.contributionCount };
      }
    }
  }
  return best;
}
