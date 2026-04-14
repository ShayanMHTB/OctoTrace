import { getToken } from '@/lib/auth';
import { GitHubError } from '@/lib/github';

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

/**
 * Minimal, dependency-free GitHub GraphQL client. The GraphQL endpoint is just
 * a POST with `{ query, variables }`. Runs in the browser with the stored token
 * (GitHub's GraphQL API supports CORS for authenticated requests).
 */
export async function githubGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const token = getToken();
  if (!token) throw new GitHubError('Not authenticated', 401);

  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new GitHubError(
      `GitHub GraphQL request failed: ${res.statusText}`,
      res.status,
    );
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    throw new GitHubError(json.errors[0].message, res.status);
  }
  if (!json.data) {
    throw new GitHubError('GitHub GraphQL returned no data.', res.status);
  }

  return json.data;
}
