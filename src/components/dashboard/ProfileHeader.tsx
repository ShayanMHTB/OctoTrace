'use client';

import { Building2, Calendar, ExternalLink, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useViewer } from '@/hooks/useGitHub';

export default function ProfileHeader() {
  const { data: user, isLoading } = useViewer();

  if (isLoading || !user) {
    return (
      <Card className="flex items-center gap-4 p-6">
        <Skeleton className="size-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
      <Avatar className="size-16">
        <AvatarImage src={user.avatar_url} alt={user.name ?? user.login} />
        <AvatarFallback>{user.login.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-xl font-bold">
            {user.name ?? user.login}
          </h1>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
        <p className="text-sm text-muted-foreground">@{user.login}</p>
        {user.bio && <p className="mt-1 text-sm">{user.bio}</p>}

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {user.company && (
            <span className="flex items-center gap-1">
              <Building2 className="size-3.5" />
              {user.company}
            </span>
          )}
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {user.location}
            </span>
          )}
          {user.created_at && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              Joined {format(new Date(user.created_at), 'MMM yyyy')}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
