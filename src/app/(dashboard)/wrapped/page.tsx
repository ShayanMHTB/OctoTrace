'use client';

import Link from 'next/link';
import { Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import WrappedStory, {
  type WrappedSlide,
} from '@/components/dashboard/WrappedStory';
import { useContributions, useIssuePrStats, useRepos } from '@/hooks/useGitHub';
import { aggregateRepoStats, languageCounts, topRepos } from '@/lib/github-stats';
import { busiestDay, streaks } from '@/lib/activity-stats';

export default function WrappedPage() {
  const { data: contrib } = useContributions();
  const { data: repos } = useRepos();
  const { counts } = useIssuePrStats();

  if (!contrib || !repos) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        <span className="ml-2 text-sm">Wrapping up your year…</span>
      </div>
    );
  }

  const year = new Date().getFullYear();
  const calendar = contrib.contributionCalendar;
  const totals = aggregateRepoStats(repos);
  const topLang = languageCounts(repos)[0]?.name;
  const topRepo = topRepos(repos, 'stargazers_count', 1)[0];
  const { longest } = streaks(calendar);
  const busiest = busiestDay(calendar);

  const slides: WrappedSlide[] = [
    {
      id: 'intro',
      eyebrow: 'OctoTrace Wrapped',
      value: `${year}`,
      caption: 'Your year on GitHub, in review.',
      accent: 'var(--brand-1)',
    },
    {
      id: 'contributions',
      eyebrow: 'You made',
      value: calendar.totalContributions.toLocaleString(),
      caption: 'contributions in the last year.',
      accent: 'var(--brand-1)',
    },
    {
      id: 'commits',
      eyebrow: "That's",
      value: contrib.totalCommitContributions.toLocaleString(),
      caption: 'commits — one keystroke at a time.',
      accent: 'var(--brand-2)',
    },
  ];

  if (topLang) {
    slides.push({
      id: 'language',
      eyebrow: 'You spoke',
      value: topLang,
      caption: 'more than any other language.',
      accent: 'var(--brand-3)',
    });
  }

  slides.push({
    id: 'stars',
    eyebrow: 'You earned',
    value: totals.totalStars.toLocaleString(),
    caption: 'stars across your repositories.',
    accent: 'var(--brand-1)',
  });

  if (topRepo && topRepo.stargazers_count > 0) {
    slides.push({
      id: 'top-repo',
      eyebrow: 'The star of the show',
      value: topRepo.name,
      caption: `your most-starred project, with ${topRepo.stargazers_count.toLocaleString()} ★.`,
      accent: 'var(--brand-2)',
    });
  }

  slides.push({
    id: 'streak',
    eyebrow: 'On a roll',
    value: `${longest} days`,
    caption: 'your longest contribution streak.',
    accent: 'var(--brand-3)',
  });

  if (counts.prTotal !== undefined) {
    slides.push({
      id: 'prs',
      eyebrow: 'You shipped',
      value: counts.prTotal.toLocaleString(),
      caption: `pull requests opened${
        counts.prMerged !== undefined
          ? ` · ${counts.prMerged.toLocaleString()} merged`
          : ''
      }.`,
      accent: 'var(--brand-1)',
    });
  }

  slides.push({
    id: 'outro',
    eyebrow: "Here's to",
    value: `${year + 1}`,
    caption: 'Keep building. See you next year. 🚀',
    accent: 'var(--brand-2)',
  });

  const handleCopy = () => {
    const lines = [
      `My OctoTrace Wrapped ${year}:`,
      `• ${calendar.totalContributions.toLocaleString()} contributions`,
      `• ${contrib.totalCommitContributions.toLocaleString()} commits`,
      topLang ? `• Top language: ${topLang}` : null,
      `• ${totals.totalStars.toLocaleString()} stars earned`,
      `• Longest streak: ${longest} days`,
      busiest.date ? `• Busiest day: ${busiest.date} (${busiest.count})` : null,
    ].filter(Boolean);
    navigator.clipboard
      .writeText(lines.join('\n'))
      .then(() => toast.success('Summary copied to clipboard!'))
      .catch(() => toast.error('Couldn’t copy to clipboard.'));
  };

  const footer = (
    <div className="flex gap-2">
      <Button onClick={handleCopy} className="flex-1" size="sm">
        <Copy className="size-4" />
        Copy summary
      </Button>
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Wrapped</h1>
        <p className="text-sm text-muted-foreground">
          Your GitHub year, one highlight at a time. Use ← → to navigate.
        </p>
      </div>
      <WrappedStory slides={slides} footer={footer} />
      <p className="text-center text-xs text-muted-foreground">
        Built entirely in your browser — nothing here was sent to a server.
      </p>
    </div>
  );
}
