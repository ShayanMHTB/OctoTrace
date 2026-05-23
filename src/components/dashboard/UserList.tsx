'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { GitHubUserRef } from '@/lib/github';

export default function UserList({
  users,
  isLoading,
  empty,
}: {
  users?: GitHubUserRef[];
  isLoading: boolean;
  empty: string;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }

  return (
    <ul className="max-h-80 space-y-1 overflow-y-auto pr-1">
      {users.map((user) => (
        <li key={user.id}>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
          >
            <Avatar className="size-8">
              <AvatarImage src={user.avatar_url} alt={user.login} />
              <AvatarFallback>
                {user.login.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-medium">@{user.login}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
