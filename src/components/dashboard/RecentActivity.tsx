'use client';

import {
  CircleDot,
  GitCommit,
  GitFork,
  GitPullRequest,
  Plus,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentActivity } from '@/hooks/useGitHub';
import type { GitHubEvent } from '@/lib/github';

function describe(event: GitHubEvent): { icon: LucideIcon; text: string } {
  const repo = event.repo.name;
  switch (event.type) {
    case 'PushEvent': {
      const n = event.payload.size ?? event.payload.commits?.length ?? 0;
      return {
        icon: GitCommit,
        text: `Pushed ${n} commit${n === 1 ? '' : 's'} to ${repo}`,
      };
    }
    case 'CreateEvent':
      return {
        icon: Plus,
        text: `Created ${event.payload.ref_type ?? 'repository'} in ${repo}`,
      };
    case 'WatchEvent':
      return { icon: Star, text: `Starred ${repo}` };
    case 'ForkEvent':
      return { icon: GitFork, text: `Forked ${repo}` };
    case 'PullRequestEvent':
      return {
        icon: GitPullRequest,
        text: `${event.payload.action ?? 'Updated'} a pull request in ${repo}`,
      };
    case 'IssuesEvent':
      return {
        icon: CircleDot,
        text: `${event.payload.action ?? 'Updated'} an issue in ${repo}`,
      };
    default:
      return { icon: GitCommit, text: `Activity in ${repo}` };
  }
}

export default function RecentActivity() {
  const { data: events, isLoading } = useRecentActivity();

  return (
    <Card className="p-6">
      <h3 className="mb-4 font-semibold">Recent activity</h3>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent activity.</p>
      ) : (
        <ul className="space-y-3">
          {events.slice(0, 8).map((event) => {
            const { icon: Icon, text } = describe(event);
            return (
              <li key={event.id} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border bg-background text-muted-foreground">
                  <Icon className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1 truncate">{text}</span>
                {event.created_at && (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(event.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
