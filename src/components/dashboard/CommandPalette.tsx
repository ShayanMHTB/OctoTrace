'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useQueryClient } from '@tanstack/react-query';
import { del } from 'idb-keyval';
import { toast } from 'sonner';
import {
  Activity,
  Database,
  FolderGit2,
  Github,
  GitPullRequest,
  Languages,
  LayoutDashboard,
  LogOut,
  MonitorCog,
  Orbit,
  Moon,
  Settings,
  Sparkles,
  Star,
  Sun,
  Trash2,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useAuth } from '@/lib/auth';
import { useRepos } from '@/hooks/useGitHub';

/** Fire this from anywhere (e.g. a header button) to open the palette. */
export const COMMAND_EVENT = 'octotrace:open-command';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/galaxy', icon: Orbit, label: 'Galaxy' },
  { href: '/repos', icon: FolderGit2, label: 'Repositories' },
  { href: '/languages', icon: Languages, label: 'Languages' },
  { href: '/activity', icon: Activity, label: 'Activity' },
  { href: '/trends', icon: TrendingUp, label: 'Trends' },
  { href: '/sql', icon: Database, label: 'SQL Explorer' },
  { href: '/pull-requests', icon: GitPullRequest, label: 'PRs & Issues' },
  { href: '/social', icon: Users, label: 'Social' },
  { href: '/wrapped', icon: Sparkles, label: 'Wrapped' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const { data: repos } = useRepos();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(COMMAND_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(COMMAND_EVENT, onOpen);
    };
  }, []);

  const run = useCallback((action: () => void) => {
    setOpen(false);
    action();
  }, []);

  const clearCache = useCallback(async () => {
    queryClient.clear();
    await del('octotrace-query-cache');
    toast.success('Cleared cached data — it will refresh from GitHub.');
  }, [queryClient]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, repositories, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {NAV.map((item) => (
            <CommandItem
              key={item.href}
              value={`go ${item.label}`}
              onSelect={() => run(() => router.push(item.href))}
            >
              <item.icon className="size-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        {repos && repos.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Repositories">
              {repos.slice(0, 50).map((repo) => (
                <CommandItem
                  key={repo.id}
                  value={`repo ${repo.full_name}`}
                  onSelect={() =>
                    run(() => router.push(`/repos/${repo.full_name}`))
                  }
                >
                  <Github className="size-4" />
                  <span className="truncate">{repo.name}</span>
                  {repo.stargazers_count > 0 && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="size-3" />
                      {repo.stargazers_count}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="theme light" onSelect={() => run(() => setTheme('light'))}>
            <Sun className="size-4" />
            Light theme
          </CommandItem>
          <CommandItem value="theme dark" onSelect={() => run(() => setTheme('dark'))}>
            <Moon className="size-4" />
            Dark theme
          </CommandItem>
          <CommandItem value="theme system" onSelect={() => run(() => setTheme('system'))}>
            <MonitorCog className="size-4" />
            System theme
          </CommandItem>
          <CommandItem value="clear cache" onSelect={() => run(clearCache)}>
            <Trash2 className="size-4" />
            Clear cached data
          </CommandItem>
          <CommandItem
            value="sign out logout"
            onSelect={() => run(logout)}
          >
            <LogOut className="size-4" />
            Sign out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
