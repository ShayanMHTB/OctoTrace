'use client';

import { ResponsiveTreeMap } from '@nivo/treemap';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRepos } from '@/hooks/useGitHub';
import { languageColor } from '@/lib/language-colors';
import { nivoTheme } from '@/lib/nivo-theme';
import { formatBytes } from '@/utils/numbers';

interface TreeNode {
  name: string;
  value?: number;
  language?: string | null;
  children?: TreeNode[];
}

export default function RepoTreemap() {
  const { data: repos, isLoading } = useRepos();

  const children: TreeNode[] = (repos ?? [])
    .filter((r) => r.size > 0)
    .map((r) => ({ name: r.name, value: r.size, language: r.language }));

  const data: TreeNode = { name: 'repos', children };

  return (
    <Card className="p-6">
      <h3 className="mb-1 font-semibold">Repository sizes</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Each tile is a repo, sized by code volume and colored by language.
      </p>
      <div className="h-80 w-full">
        {isLoading ? (
          <Skeleton className="size-full rounded-lg" />
        ) : children.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No repositories to display.
          </div>
        ) : (
          <ResponsiveTreeMap
            data={data}
            identity="name"
            value="value"
            theme={nivoTheme}
            colors={(node) => languageColor(node.data.language)}
            nodeOpacity={0.92}
            borderWidth={1}
            borderColor="var(--background)"
            labelSkipSize={24}
            label={(node) => node.id}
            labelTextColor={{ from: 'color', modifiers: [['darker', 2.6]] }}
            tooltip={({ node }) => (
              <div className="rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
                <span className="font-medium">{node.id}</span>
                <span className="text-muted-foreground">
                  {' '}
                  — {formatBytes((node.value ?? 0) * 1024)}
                </span>
              </div>
            )}
            animate={false}
          />
        )}
      </div>
    </Card>
  );
}
