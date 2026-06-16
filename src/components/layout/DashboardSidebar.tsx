'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Database,
  FolderGit2,
  Github,
  GitPullRequest,
  Languages,
  LayoutDashboard,
  Orbit,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

const GROUPS = [
  {
    label: 'Menu',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, title: 'Overview' },
      { href: '/galaxy', icon: Orbit, title: 'Galaxy' },
      { href: '/wrapped', icon: Sparkles, title: 'Wrapped' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/repos', icon: FolderGit2, title: 'Repositories' },
      { href: '/languages', icon: Languages, title: 'Languages' },
      { href: '/activity', icon: Activity, title: 'Activity' },
      { href: '/trends', icon: TrendingUp, title: 'Trends' },
      { href: '/sql', icon: Database, title: 'SQL Explorer' },
    ],
  },
  {
    label: 'Community',
    items: [
      { href: '/pull-requests', icon: GitPullRequest, title: 'PRs & Issues' },
      { href: '/social', icon: Users, title: 'Social' },
    ],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sidebar>
      <SidebarHeader className="h-14 justify-center border-b">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-2 text-lg font-bold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-foreground text-background">
            <Github className="size-4.5" />
          </span>
          <span>OctoTrace</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/settings')}
              tooltip="Settings"
            >
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
