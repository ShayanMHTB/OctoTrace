'use client';

import { FolderGit2, Link2, Mail, Twitter, Users } from 'lucide-react';
import StatCard from '@/components/blocks/StatCard';
import ProfileHeader from '@/components/dashboard/ProfileHeader';
import ContributionCalendar from '@/components/dashboard/ContributionCalendar';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useViewer } from '@/hooks/useGitHub';

export default function ProfilePage() {
  const { data: user } = useViewer();

  const tiles = [
    { label: 'Public repos', value: user?.public_repos, icon: FolderGit2 },
    { label: 'Followers', value: user?.followers, icon: Users },
    { label: 'Following', value: user?.following, icon: Users },
    { label: 'Gists', value: user?.public_gists, icon: FolderGit2 },
  ];

  const links =
    user &&
    [
      user.blog
        ? {
            icon: Link2,
            label: user.blog,
            href: user.blog.startsWith('http')
              ? user.blog
              : `https://${user.blog}`,
          }
        : null,
      user.twitter_username
        ? {
            icon: Twitter,
            label: `@${user.twitter_username}`,
            href: `https://x.com/${user.twitter_username}`,
          }
        : null,
      user.email
        ? { icon: Mail, label: user.email, href: `mailto:${user.email}` }
        : null,
    ].filter((x): x is { icon: typeof Link2; label: string; href: string } =>
      Boolean(x),
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your GitHub identity, as OctoTrace sees it.
        </p>
      </div>

      <ProfileHeader />

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
            />
          ),
        )}
      </div>

      {links && links.length > 0 && (
        <Card className="p-6">
          <h2 className="mb-3 font-semibold">Links</h2>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <link.icon className="size-4" />
                  <span className="truncate">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <ContributionCalendar />
    </div>
  );
}
