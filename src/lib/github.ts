import { getToken } from '@/lib/auth';

const GITHUB_API = 'https://api.github.com';

/** Subset of the GitHub authenticated-user payload we care about. */
export interface GitHubUser {
  login: string;
  id: number;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  email: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export class GitHubError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'GitHubError';
    this.status = status;
  }
}

/**
 * Fetch the GitHub REST API directly from the browser, attaching the stored
 * token. GitHub's REST API supports CORS for these requests, so no server
 * proxy is needed.
 */
async function githubFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  if (!token) throw new GitHubError('Not authenticated', 401);

  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // response had no JSON body; keep statusText
    }
    throw new GitHubError(message, res.status);
  }

  return res.json() as Promise<T>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch a GitHub `/stats/*` endpoint, which returns 202 while GitHub computes
 * the data server-side. Polls a few times, then gives up (returns null).
 * Returns null on 204 too (empty repo).
 */
async function fetchStat<T>(path: string, retries = 3): Promise<T | null> {
  const token = getToken();
  if (!token) throw new GitHubError('Not authenticated', 401);

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(`${GITHUB_API}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (res.status === 202) {
      await sleep(1200 * (attempt + 1));
      continue;
    }
    if (res.status === 204) return null;
    if (!res.ok) throw new GitHubError(res.statusText, res.status);
    return res.json() as Promise<T>;
  }
  return null; // still computing after retries
}

/** GET /user — the authenticated user's profile. */
export function getCurrentUser(): Promise<GitHubUser> {
  return githubFetch<GitHubUser>('/user');
}

/** A single repo by "owner/name". */
export function getRepo(fullName: string): Promise<GitHubRepo> {
  return githubFetch<GitHubRepo>(`/repos/${fullName}`);
}

export interface CommitActivityWeek {
  week: number; // unix seconds
  total: number;
  days: number[];
}

/** Weekly commit counts for the last year (202-polled). */
export function getRepoCommitActivity(
  fullName: string,
): Promise<CommitActivityWeek[] | null> {
  return fetchStat<CommitActivityWeek[]>(
    `/repos/${fullName}/stats/commit_activity`,
  );
}

export interface GitHubCommit {
  sha: string;
  html_url: string;
  commit: { message: string; author: { name: string; date: string } | null };
  author: { login: string; avatar_url: string } | null;
}

/** Most recent commits on the default branch. */
export function getRepoCommits(fullName: string): Promise<GitHubCommit[]> {
  return githubFetch<GitHubCommit[]>(`/repos/${fullName}/commits?per_page=10`);
}

export interface GitHubRelease {
  id: number;
  name: string | null;
  tag_name: string;
  html_url: string;
  published_at: string | null;
}

/** Latest releases. */
export function getRepoReleases(fullName: string): Promise<GitHubRelease[]> {
  return githubFetch<GitHubRelease[]>(`/repos/${fullName}/releases?per_page=5`);
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  size: number;
  fork: boolean;
  archived: boolean;
  private: boolean;
  topics: string[];
  default_branch: string;
  license: { spdx_id: string | null; name: string } | null;
  pushed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * All repos the user owns (incl. private, since we hold the `repo` scope),
 * paginated to completion. This single dataset powers the Overview stats, the
 * Repositories table, and the Languages breakdown — fetch once, cache, reuse.
 */
export async function getViewerRepos(): Promise<GitHubRepo[]> {
  const perPage = 100;
  const all: GitHubRepo[] = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await githubFetch<GitHubRepo[]>(
      `/user/repos?per_page=${perPage}&page=${page}&affiliation=owner&sort=pushed`,
    );
    all.push(...batch);
    if (batch.length < perPage) break; // last page reached
  }
  return all;
}

export interface GitHubEvent {
  id: string;
  type: string | null;
  created_at: string | null;
  repo: { id: number; name: string; url: string };
  payload: {
    action?: string;
    ref?: string | null;
    ref_type?: string;
    size?: number;
    commits?: { message: string }[];
  };
}

/** Recent public activity for a user (push/PR/issue/star/etc.). */
export function getUserEvents(login: string): Promise<GitHubEvent[]> {
  return githubFetch<GitHubEvent[]>(`/users/${login}/events?per_page=30`);
}

/** Byte counts per language for a single repo, e.g. `{ TypeScript: 12345 }`. */
export function getRepoLanguages(
  fullName: string,
): Promise<Record<string, number>> {
  return githubFetch<Record<string, number>>(`/repos/${fullName}/languages`);
}

export interface GitHubSearchItem {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  draft?: boolean;
  created_at: string;
  updated_at: string;
  repository_url: string;
  pull_request?: { merged_at: string | null };
}

export interface IssueSearchResult {
  total_count: number;
  items: GitHubSearchItem[];
}

/**
 * GitHub issue/PR search. Use `perPage: 1` when you only need `total_count`.
 * NOTE: the Search API is rate-limited to ~30 requests/min — cache aggressively.
 */
export function searchIssues(
  q: string,
  perPage = 1,
  sort?: 'updated' | 'created',
): Promise<IssueSearchResult> {
  const params = new URLSearchParams({ q, per_page: String(perPage) });
  if (sort) {
    params.set('sort', sort);
    params.set('order', 'desc');
  }
  return githubFetch<IssueSearchResult>(`/search/issues?${params.toString()}`);
}

/** Derive "owner/name" from a search item's repository_url. */
export function repoFromUrl(repositoryUrl: string): string {
  return repositoryUrl.replace('https://api.github.com/repos/', '');
}

export interface GitHubUserRef {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

async function paginateAll<T>(
  buildPath: (page: number) => string,
  perPage = 100,
  maxPages = 10,
): Promise<T[]> {
  const all: T[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const batch = await githubFetch<T[]>(buildPath(page));
    all.push(...batch);
    if (batch.length < perPage) break;
  }
  return all;
}

/** Users following the authenticated user (paginated). */
export function getFollowers(): Promise<GitHubUserRef[]> {
  return paginateAll<GitHubUserRef>(
    (p) => `/user/followers?per_page=100&page=${p}`,
  );
}

/** Users the authenticated user follows (paginated). */
export function getFollowing(): Promise<GitHubUserRef[]> {
  return paginateAll<GitHubUserRef>(
    (p) => `/user/following?per_page=100&page=${p}`,
  );
}
