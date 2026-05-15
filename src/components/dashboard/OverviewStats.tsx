'use client';

import { Activity, FolderGit2, Star, Users } from 'lucide-react';
import StatCard from '@/components/blocks/StatCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useContributionCalendar,
  useRepos,
  useViewer,
} from '@/hooks/useGitHub';
import { aggregateRepoStats } from '@/lib/github-stats';

export default function OverviewStats() {
  const { data: repos } = useRepos();
  const { data: viewer } = useViewer();
  const { data: calendar } = useContributionCalendar();

  const totals = repos ? aggregateRepoStats(repos) : undefined;

  const tiles = [
    {
      label: 'Total stars',
      value: totals?.totalStars,
      icon: Star,
      hint: totals ? `across ${totals.totalRepos} repos` : undefined,
    },
    {
      label: 'Repositories',
      value: totals?.totalRepos,
      icon: FolderGit2,
      hint: totals
        ? `${totals.publicRepos} public · ${totals.privateRepos} private`
        : undefined,
    },
    {
      label: 'Followers',
      value: viewer?.followers,
      icon: Users,
      hint: viewer ? `${viewer.following.toLocaleString()} following` : undefined,
    },
    {
      label: 'Contributions',
      value: calendar?.totalContributions,
      icon: Activity,
      hint: 'last year',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map((tile) =>
        tile.value === undefined ? (
          <Card key={tile.label} className="gap-0 p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-16" />
          </Card>
        ) : (
          <StatCard
            key={tile.label}
            label={tile.label}
            value={tile.value}
            icon={tile.icon}
            hint={tile.hint}
          />
        ),
      )}
    </div>
  );
}
