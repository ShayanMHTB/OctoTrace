'use client';

import Link from 'next/link';
import { LogOut, Search, Settings, User } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';
import { ThemeToggle } from '../shared/ThemeToggle';
import { COMMAND_EVENT } from '../dashboard/CommandPalette';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/lib/auth';
import { useViewer } from '@/hooks/useGitHub';

export default function DashboardHeader() {
  const { logout } = useAuth();
  const { data: user } = useViewer();

  const displayName = user?.name || user?.login;
  const initial = (user?.login ?? '?').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(COMMAND_EVENT))}
          className="flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          <Search className="size-3.5" />
          <span className="hidden sm:inline">Search…</span>
          <kbd className="hidden rounded border bg-background px-1.5 text-[10px] font-medium sm:inline">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="size-8">
                <AvatarImage src={user?.avatar_url} alt={displayName ?? ''} />
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="truncate">{displayName ?? 'GitHub user'}</span>
              {user?.login && (
                <span className="text-xs font-normal text-muted-foreground">
                  @{user.login}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="size-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="size-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} variant="destructive">
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
