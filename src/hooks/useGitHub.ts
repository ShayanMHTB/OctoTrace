'use client';

import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getCurrentUser,
  getFollowers,
  getFollowing,
  getRepo,
  getRepoCommitActivity,
  getRepoCommits,
  getRepoLanguages,
  getRepoReleases,
  getUserEvents,
  getViewerRepos,
  searchIssues,
} from '@/lib/github';
import { githubGraphQL } from '@/lib/github-graphql';

/** Authenticated user profile (REST). */
export function useViewer() {
  return useQuery({
    queryKey: ['viewer'],
    queryFn: getCurrentUser,
  });
}

/** All repos the user owns (REST, paginated). */
export function useRepos() {
  return useQuery({
    queryKey: ['repos'],
    queryFn: getViewerRepos,
  });
}

/** Recent activity feed for the authenticated user (REST). */
export function useRecentActivity() {
  const { data: viewer } = useViewer();
  const login = viewer?.login;
  return useQuery({
    queryKey: ['events', login],
    queryFn: () => getUserEvents(login!),
    enabled: Boolean(login),
  });
}

export interface LanguageBytes {
  name: string;
  bytes: number;
  percent: number;
  repoCount: number;
}

/**
 * Bytes-accurate language breakdown across all repos. Fans out one cached
 * `/languages` request per repo (each persisted independently, so the heavy
 * work happens once), then aggregates byte totals.
 */
export function useLanguageBytes() {
  const { data: repos } = useRepos();
  const list = repos ?? [];

  const results = useQueries({
    queries: list.map((repo) => ({
      queryKey: ['repo-languages', repo.full_name],
      queryFn: () => getRepoLanguages(repo.full_name),
      staleTime: 1000 * 60 * 60, // 1 hour — language mix changes slowly
    })),
  });

  const loaded = results.filter((r) => r.isSuccess).length;
  const total = list.length;

  const languages = useMemo(() => {
    const bytesByLang = new Map<string, number>();
    const reposByLang = new Map<string, number>();
    for (const result of results) {
      if (!result.data) continue;
      for (const [lang, bytes] of Object.entries(result.data)) {
        bytesByLang.set(lang, (bytesByLang.get(lang) ?? 0) + bytes);
        reposByLang.set(lang, (reposByLang.get(lang) ?? 0) + 1);
      }
    }
    const totalBytes = [...bytesByLang.values()].reduce((a, b) => a + b, 0) || 1;
    return [...bytesByLang.entries()]
      .map(([name, bytes]) => ({
        name,
        bytes,
        percent: (bytes / totalBytes) * 100,
        repoCount: reposByLang.get(name) ?? 0,
      }))
      .sort((a, b) => b.bytes - a.bytes) as LanguageBytes[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, total]);

  const totalBytes = languages.reduce((a, l) => a + l.bytes, 0);

  return {
    languages,
    totalBytes,
    loaded,
    total,
    isPending: repos === undefined || (total > 0 && loaded < total),
  };
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
  weekday: number;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: { contributionDays: ContributionDay[] }[];
}

export interface ContributionsCollection {
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  restrictedContributionsCount: number;
  contributionCalendar: ContributionCalendar;
}

const CONTRIBUTIONS_QUERY = /* GraphQL */ `
  query Contributions {
    viewer {
      contributionsCollection {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
              weekday
            }
          }
        }
      }
    }
  }
`;

type ContributionsResponse = {
  viewer: { contributionsCollection: ContributionsCollection };
};

const fetchContributions = () =>
  githubGraphQL<ContributionsResponse>(CONTRIBUTIONS_QUERY);

/** Full contributions collection (GraphQL): totals + calendar, one query. */
export function useContributions() {
  return useQuery({
    queryKey: ['contributions'],
    queryFn: fetchContributions,
    select: (data) => data.viewer.contributionsCollection,
  });
}

/**
 * Just the contribution calendar. Shares the ['contributions'] query/cache
 * with useContributions — same single network request, different selector.
 */
export function useContributionCalendar() {
  return useQuery({
    queryKey: ['contributions'],
    queryFn: fetchContributions,
    select: (data) => data.viewer.contributionsCollection.contributionCalendar,
  });
}

const SEARCH_STALE = 1000 * 60 * 30; // 30 min — Search API is rate-limited

export interface IssuePrCounts {
  prTotal?: number;
  prMerged?: number;
  prOpen?: number;
  issueTotal?: number;
  issueOpen?: number;
  issueClosed?: number;
}

/**
 * Aggregate PR/issue counts for the viewer via the Search API. Each count is a
 * cheap (per_page=1, total_count only) cached query run in parallel.
 */
export function useIssuePrStats() {
  const { data: viewer } = useViewer();
  const login = viewer?.login;

  const defs = login
    ? [
        { id: 'prTotal', q: `type:pr author:${login}` },
        { id: 'prMerged', q: `type:pr author:${login} is:merged` },
        { id: 'prOpen', q: `type:pr author:${login} is:open` },
        { id: 'issueTotal', q: `type:issue author:${login}` },
        { id: 'issueOpen', q: `type:issue author:${login} is:open` },
        { id: 'issueClosed', q: `type:issue author:${login} is:closed` },
      ]
    : [];

  const results = useQueries({
    queries: defs.map((d) => ({
      queryKey: ['search-count', d.id, login],
      queryFn: () => searchIssues(d.q, 1).then((r) => r.total_count),
      enabled: Boolean(login),
      staleTime: SEARCH_STALE,
    })),
  });

  const counts: IssuePrCounts = {};
  defs.forEach((d, i) => {
    counts[d.id as keyof IssuePrCounts] = results[i]?.data;
  });

  return {
    counts,
    isLoading: !login || results.some((r) => r.isLoading),
  };
}

/** Open PRs and issues authored by the viewer, across all repos. */
export function useOpenWork() {
  const { data: viewer } = useViewer();
  const login = viewer?.login;
  return useQuery({
    queryKey: ['open-work', login],
    queryFn: () =>
      searchIssues(`author:${login} is:open`, 20, 'updated').then(
        (r) => r.items,
      ),
    enabled: Boolean(login),
    staleTime: SEARCH_STALE,
  });
}

/** Users following the viewer. */
export function useFollowers() {
  return useQuery({ queryKey: ['followers'], queryFn: getFollowers });
}

/** Users the viewer follows. */
export function useFollowing() {
  return useQuery({ queryKey: ['following'], queryFn: getFollowing });
}

// ---- Single repo (detail page) ----

export function useRepo(fullName: string) {
  return useQuery({
    queryKey: ['repo', fullName],
    queryFn: () => getRepo(fullName),
    enabled: Boolean(fullName),
  });
}

export function useRepoCommitActivity(fullName: string) {
  return useQuery({
    queryKey: ['repo-commit-activity', fullName],
    queryFn: () => getRepoCommitActivity(fullName),
    enabled: Boolean(fullName),
    staleTime: 1000 * 60 * 60,
  });
}

/** Per-repo language bytes — shares cache with the Languages page fan-out. */
export function useRepoLanguagesFor(fullName: string) {
  return useQuery({
    queryKey: ['repo-languages', fullName],
    queryFn: () => getRepoLanguages(fullName),
    enabled: Boolean(fullName),
    staleTime: 1000 * 60 * 60,
  });
}

export function useRepoCommits(fullName: string) {
  return useQuery({
    queryKey: ['repo-commits', fullName],
    queryFn: () => getRepoCommits(fullName),
    enabled: Boolean(fullName),
  });
}

export function useRepoReleases(fullName: string) {
  return useQuery({
    queryKey: ['repo-releases', fullName],
    queryFn: () => getRepoReleases(fullName),
    enabled: Boolean(fullName),
  });
}
