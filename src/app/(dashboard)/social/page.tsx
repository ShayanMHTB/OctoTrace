'use client';

import { useMemo } from 'react';
import { Star, UserMinus, UserPlus, Users } from 'lucide-react';
import StatCard from '@/components/blocks/StatCard';
import UserList from '@/components/dashboard/UserList';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useFollowers, useFollowing, useRepos } from '@/hooks/useGitHub';
import { topRepos } from '@/lib/github-stats';

export default function SocialPage() {
  const { data: followers, isLoading: loadingFollowers } = useFollowers();
  const { data: following, isLoading: loadingFollowing } = useFollowing();
  const { data: repos } = useRepos();

  const loading = loadingFollowers || loadingFollowing;
  const ready = Boolean(followers && following);

  const { notFollowingBack, fans, mutuals } = useMemo(() => {
    const followerLogins = new Set((followers ?? []).map((u) => u.login));
    const followingLogins = new Set((following ?? []).map((u) => u.login));
    return {
      notFollowingBack: (following ?? []).filter(
        (u) => !followerLogins.has(u.login),
      ),
      fans: (followers ?? []).filter((u) => !followingLogins.has(u.login)),
      mutuals: (following ?? []).filter((u) => followerLogins.has(u.login))
        .length,
    };
  }, [followers, following]);

  const followerCount = followers?.length;
  const followingCount = following?.length;
  const ratio =
    followerCount !== undefined && followingCount
      ? (followerCount / followingCount).toFixed(2)
      : followerCount !== undefined
        ? '∞'
        : undefined;

  const starred = repos ? topRepos(repos, 'stargazers_count', 5) : undefined;

  const tiles = [
    { label: 'Followers', value: followerCount, icon: Users },
    { label: 'Following', value: followingCount, icon: UserPlus },
    {
      label: 'Mutuals',
      value: ready ? mutuals : undefined,
      icon: Users,
      hint: 'follow each other',
    },
    { label: 'Follower ratio', value: ratio, icon: UserPlus },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Social</h1>
        <p className="text-sm text-muted-foreground">
          Your followers, who you follow, and who’s starring your work.
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
          <div className="mb-4 flex items-center gap-2">
            <UserMinus className="size-4 text-muted-foreground" />
            <h3 className="font-semibold">Not following you back</h3>
            {ready && (
              <span className="text-sm text-muted-foreground">
                ({notFollowingBack.length})
              </span>
            )}
          </div>
          <UserList
            users={notFollowingBack}
            isLoading={loading}
            empty="Everyone you follow follows you back. 🙌"
          />
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <UserPlus className="size-4 text-muted-foreground" />
            <h3 className="font-semibold">Fans you don’t follow back</h3>
            {ready && (
              <span className="text-sm text-muted-foreground">
                ({fans.length})
              </span>
            )}
          </div>
          <UserList
            users={fans}
            isLoading={loading}
            empty="You follow back all your followers."
          />
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Star className="size-4 text-[var(--brand-1)]" />
          <h3 className="font-semibold">Most starred repositories</h3>
        </div>
        {!starred ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : starred.length === 0 ? (
          <p className="text-sm text-muted-foreground">No repositories yet.</p>
        ) : (
          <ul className="divide-y">
            {starred.map((repo) => (
              <li
                key={repo.id}
                className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
              >
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-sm font-medium hover:text-[var(--brand-1)]"
                >
                  {repo.name}
                </a>
                <span className="flex items-center gap-1 text-sm text-muted-foreground tabular-nums">
                  <Star className="size-3.5" />
                  {repo.stargazers_count.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
