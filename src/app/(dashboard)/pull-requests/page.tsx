'use client';

import { CircleDot, GitMerge, GitPullRequest, Inbox } from 'lucide-react';
import StatCard from '@/components/blocks/StatCard';
import OpenWorkInbox from '@/components/dashboard/OpenWorkInbox';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIssuePrStats } from '@/hooks/useGitHub';

function BreakdownBars({
  items,
}: {
  items: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label} className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{item.label}</span>
            <span className="tabular-nums text-muted-foreground">
              {item.value.toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function PullRequestsPage() {
  const { counts, isLoading } = useIssuePrStats();

  const prTotal = counts.prTotal ?? 0;
  const prMerged = counts.prMerged ?? 0;
  const prOpen = counts.prOpen ?? 0;
  const prClosed = Math.max(0, prTotal - prMerged - prOpen);
  const issueOpen = counts.issueOpen ?? 0;
  const issueClosed = counts.issueClosed ?? 0;
  const mergeRate = prTotal ? Math.round((prMerged / prTotal) * 100) : 0;

  const tiles = [
    {
      label: 'PRs opened',
      value: counts.prTotal,
      icon: GitPullRequest,
      hint: counts.prTotal !== undefined ? `${prOpen} still open` : undefined,
    },
    {
      label: 'Merge rate',
      value: counts.prTotal !== undefined ? `${mergeRate}%` : undefined,
      icon: GitMerge,
      hint:
        counts.prMerged !== undefined
          ? `${prMerged.toLocaleString()} merged`
          : undefined,
    },
    {
      label: 'Issues opened',
      value: counts.issueTotal,
      icon: CircleDot,
      hint:
        counts.issueOpen !== undefined ? `${issueOpen} still open` : undefined,
    },
    {
      label: 'Open items',
      value:
        counts.prOpen !== undefined && counts.issueOpen !== undefined
          ? prOpen + issueOpen
          : undefined,
      icon: Inbox,
      hint: 'PRs + issues',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">PRs &amp; Issues</h1>
        <p className="text-sm text-muted-foreground">
          Your pull request and issue activity across all of GitHub.
        </p>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Pull requests</h3>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <BreakdownBars
              items={[
                { label: 'Merged', value: prMerged, color: 'var(--brand-3)' },
                { label: 'Open', value: prOpen, color: 'var(--brand-1)' },
                { label: 'Closed (unmerged)', value: prClosed, color: 'var(--muted-foreground)' },
              ]}
            />
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Issues</h3>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <BreakdownBars
              items={[
                { label: 'Open', value: issueOpen, color: 'var(--brand-1)' },
                { label: 'Closed', value: issueClosed, color: 'var(--brand-2)' },
              ]}
            />
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Open work</h3>
        <OpenWorkInbox />
      </Card>
    </div>
  );
}
