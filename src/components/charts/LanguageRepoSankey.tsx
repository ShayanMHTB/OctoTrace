'use client';

import { ResponsiveSankey } from '@nivo/sankey';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRepos } from '@/hooks/useGitHub';
import { languageColor } from '@/lib/language-colors';
import { nivoTheme } from '@/lib/nivo-theme';

const REPO = 'repo:';
const LANG = 'lang:';
const strip = (id: string) => id.replace(REPO, '').replace(LANG, '');

export default function LanguageRepoSankey() {
  const { data: repos, isLoading } = useRepos();

  const top = (repos ?? [])
    .filter((r) => r.language && r.size > 0)
    .sort((a, b) => b.size - a.size)
    .slice(0, 12);

  const nodeIds = new Set<string>();
  for (const r of top) {
    nodeIds.add(`${REPO}${r.name}`);
    nodeIds.add(`${LANG}${r.language}`);
  }
  const nodes = [...nodeIds].map((id) => ({ id }));
  const links = top.map((r) => ({
    source: `${REPO}${r.name}`,
    target: `${LANG}${r.language}`,
    value: r.size,
  }));

  const hasData = links.length > 0;

  return (
    <Card className="p-6">
      <h3 className="mb-1 font-semibold">Where your code lives</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Your largest repositories flowing into their primary language.
      </p>
      <div className="h-96 w-full">
        {isLoading ? (
          <Skeleton className="size-full rounded-lg" />
        ) : !hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No repositories to display.
          </div>
        ) : (
          <ResponsiveSankey
            data={{ nodes, links }}
            theme={nivoTheme}
            margin={{ top: 8, right: 120, bottom: 8, left: 12 }}
            align="justify"
            colors={(node) =>
              node.id.startsWith(LANG)
                ? languageColor(strip(node.id))
                : 'var(--muted-foreground)'
            }
            nodeOpacity={1}
            nodeThickness={14}
            nodeBorderWidth={0}
            linkOpacity={0.35}
            label={(node) => strip(node.id)}
            labelTextColor="var(--foreground)"
            animate={false}
          />
        )}
      </div>
    </Card>
  );
}
