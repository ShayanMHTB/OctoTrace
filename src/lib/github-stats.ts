import type { GitHubRepo } from '@/lib/github';

export interface RepoTotals {
  totalRepos: number;
  publicRepos: number;
  privateRepos: number;
  forks: number;
  totalStars: number;
  totalForks: number;
  totalOpenIssues: number;
  totalWatchers: number;
}

/** Roll up headline numbers across the full repo list. */
export function aggregateRepoStats(repos: GitHubRepo[]): RepoTotals {
  const totals: RepoTotals = {
    totalRepos: repos.length,
    publicRepos: 0,
    privateRepos: 0,
    forks: 0,
    totalStars: 0,
    totalForks: 0,
    totalOpenIssues: 0,
    totalWatchers: 0,
  };

  for (const r of repos) {
    if (r.private) totals.privateRepos++;
    else totals.publicRepos++;
    if (r.fork) totals.forks++;
    totals.totalStars += r.stargazers_count;
    totals.totalForks += r.forks_count;
    totals.totalOpenIssues += r.open_issues_count;
    totals.totalWatchers += r.watchers_count;
  }

  return totals;
}

export interface LanguageCount {
  name: string;
  count: number;
  percent: number;
}

/**
 * Count repos by their primary language. Cheap (uses the `language` field
 * already present on each repo) — a bytes-accurate breakdown via per-repo
 * `/languages` calls is reserved for the Languages page.
 */
export function languageCounts(repos: GitHubRepo[]): LanguageCount[] {
  const map = new Map<string, number>();
  for (const r of repos) {
    if (!r.language) continue;
    map.set(r.language, (map.get(r.language) ?? 0) + 1);
  }
  const total = [...map.values()].reduce((a, b) => a + b, 0) || 1;
  return [...map.entries()]
    .map(([name, count]) => ({
      name,
      count,
      percent: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

/** Top repos by a numeric field (default: stars). */
export function topRepos(
  repos: GitHubRepo[],
  by: keyof Pick<GitHubRepo, 'stargazers_count' | 'forks_count'> = 'stargazers_count',
  limit = 5,
): GitHubRepo[] {
  return [...repos].sort((a, b) => b[by] - a[by]).slice(0, limit);
}
