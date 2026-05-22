'use client';

import { CircleDot, GitPullRequest } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useOpenWork } from '@/hooks/useGitHub';
import { repoFromUrl, type GitHubSearchItem } from '@/lib/github';

function isPR(item: GitHubSearchItem) {
  return Boolean(item.pull_request);
}

export default function OpenWorkInbox() {
  const { data: items, isLoading } = useOpenWork();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nothing open — you’re all caught up. 🎉
      </p>
    );
  }

  return (
    <ul className="divide-y">
      {items.map((item) => {
        const pr = isPR(item);
        const Icon = pr ? GitPullRequest : CircleDot;
        return (
          <li key={item.id} className="py-3 first:pt-0 last:pb-0">
            <a
              href={item.html_url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-3"
            >
              <Icon
                className={
                  pr
                    ? 'mt-0.5 size-4 shrink-0 text-[var(--brand-2)]'
                    : 'mt-0.5 size-4 shrink-0 text-[var(--brand-1)]'
                }
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium group-hover:text-[var(--brand-1)]">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {repoFromUrl(item.repository_url)} #{item.number} ·{' '}
                  {pr ? 'PR' : 'Issue'}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.updated_at), {
                  addSuffix: true,
                })}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
