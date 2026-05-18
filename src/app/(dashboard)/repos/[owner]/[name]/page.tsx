'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CircleDot,
  ExternalLink,
  GitFork,
  Loader2,
  Scale,
  Star,
  Tag,
  X,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import StatCard from '@/components/blocks/StatCard';
import CommitTrend from '@/components/charts/CommitTrend';
import LanguageBreakdown from '@/components/dashboard/LanguageBreakdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useRepo,
  useRepoCommitActivity,
  useRepoCommits,
  useRepoLanguagesFor,
  useRepoReleases,
} from '@/hooks/useGitHub';

const SIX_MONTHS = 1000 * 60 * 60 * 24 * 180;

export default function RepoDetailPage() {
  const params = useParams<{ owner: string; name: string }>();
  const fullName = `${params.owner}/${params.name}`;

  const { data: repo, isLoading, error } = useRepo(fullName);
  const { data: activity, isLoading: loadingActivity } =
    useRepoCommitActivity(fullName);
  const { data: langRecord } = useRepoLanguagesFor(fullName);
  const { data: commits, isLoading: loadingCommits } = useRepoCommits(fullName);
  const { data: releases } = useRepoReleases(fullName);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (error || !repo) {
    return (
      <Card className="mx-auto max-w-md p-8 text-center">
        <AlertCircle className="mx-auto size-8 text-destructive" />
        <p className="mt-3 font-medium">Repository not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {fullName} couldn’t be loaded.
        </p>
        <Link
          href="/repos"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--brand-1)] hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to repositories
        </Link>
      </Card>
    );
  }

  const trendData = (activity ?? []).map((w) => ({
    week: new Date(w.week * 1000).toISOString(),
    total: w.total,
  }));

  const langEntries = Object.entries(langRecord ?? {});
  const totalLangBytes = langEntries.reduce((a, [, b]) => a + b, 0) || 1;
  const languages = langEntries
    .map(([name, bytes]) => ({
      name,
      bytes,
      percent: (bytes / totalLangBytes) * 100,
      repoCount: 1,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  const pushedRecent = repo.pushed_at
    ? Date.now() - new Date(repo.pushed_at).getTime() < SIX_MONTHS
    : false;
  const checks = [
    { label: 'Has a description', ok: Boolean(repo.description) },
    { label: 'Has a license', ok: Boolean(repo.license) },
    { label: 'Has topics', ok: repo.topics.length > 0 },
    { label: 'Not archived', ok: !repo.archived },
    { label: 'Updated in last 6 months', ok: pushedRecent },
  ];
  const health = Math.round(
    (checks.filter((c) => c.ok).length / checks.length) * 100,
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/repos"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Repositories
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{repo.name}</h1>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="size-4" />
          </a>
          {repo.private && <Badge variant="outline">Private</Badge>}
          {repo.fork && <Badge variant="outline">Fork</Badge>}
          {repo.archived && <Badge variant="secondary">Archived</Badge>}
        </div>
        {repo.description && (
          <p className="mt-1 max-w-2xl text-muted-foreground">
            {repo.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {repo.license?.spdx_id && (
            <span className="flex items-center gap-1">
              <Scale className="size-3.5" />
              {repo.license.spdx_id}
            </span>
          )}
          <span>default branch: {repo.default_branch}</span>
          {repo.pushed_at && (
            <span>
              updated{' '}
              {formatDistanceToNow(new Date(repo.pushed_at), {
                addSuffix: true,
              })}
            </span>
          )}
        </div>
        {repo.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {repo.topics.map((topic) => (
              <Badge key={topic} variant="secondary" className="font-normal">
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Stars" value={repo.stargazers_count} icon={Star} />
        <StatCard label="Forks" value={repo.forks_count} icon={GitFork} />
        <StatCard
          label="Open issues"
          value={repo.open_issues_count}
          icon={CircleDot}
        />
        <StatCard label="Health" value={`${health}%`} icon={Check} />
      </div>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Commit activity (last year)</h3>
        {loadingActivity ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span className="ml-2 text-sm">GitHub is computing stats…</span>
          </div>
        ) : trendData.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No commit activity available.
          </p>
        ) : (
          <CommitTrend data={trendData} />
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Languages</h3>
          {languages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No language data for this repo.
            </p>
          ) : (
            <LanguageBreakdown languages={languages} />
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Health checklist</h3>
          <ul className="space-y-2.5">
            {checks.map((check) => (
              <li key={check.label} className="flex items-center gap-2 text-sm">
                {check.ok ? (
                  <Check className="size-4 text-[var(--brand-1)]" />
                ) : (
                  <X className="size-4 text-muted-foreground" />
                )}
                <span className={check.ok ? '' : 'text-muted-foreground'}>
                  {check.label}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Recent commits</h3>
          {loadingCommits ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : !commits || commits.length === 0 ? (
            <p className="text-sm text-muted-foreground">No commits found.</p>
          ) : (
            <ul className="space-y-3">
              {commits.slice(0, 8).map((commit) => (
                <li key={commit.sha} className="flex items-start gap-3">
                  <Avatar className="mt-0.5 size-6">
                    <AvatarImage
                      src={commit.author?.avatar_url}
                      alt={commit.author?.login ?? ''}
                    />
                    <AvatarFallback>
                      {(commit.author?.login ?? '?').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="line-clamp-1 text-sm hover:text-[var(--brand-1)]"
                    >
                      {commit.commit.message.split('\n')[0]}
                    </a>
                    {commit.commit.author?.date && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(commit.commit.author.date),
                          { addSuffix: true },
                        )}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Releases</h3>
          {!releases || releases.length === 0 ? (
            <p className="text-sm text-muted-foreground">No releases yet.</p>
          ) : (
            <ul className="space-y-3">
              {releases.map((release) => (
                <li
                  key={release.id}
                  className="flex items-center justify-between"
                >
                  <a
                    href={release.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium hover:text-[var(--brand-1)]"
                  >
                    <Tag className="size-3.5 text-muted-foreground" />
                    {release.name || release.tag_name}
                  </a>
                  {release.published_at && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(release.published_at), 'MMM d, yyyy')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
