'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRepos } from '@/hooks/useGitHub';
import { languageCounts } from '@/lib/github-stats';
import { languageColor } from '@/lib/language-colors';

export default function TopLanguages() {
  const { data: repos, isLoading } = useRepos();

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="mb-4 h-5 w-32" />
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  const langs = languageCounts(repos ?? []).slice(0, 6);

  return (
    <Card className="p-6">
      <h3 className="mb-4 font-semibold">Top languages</h3>

      {langs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No language data across your repositories yet.
        </p>
      ) : (
        <>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full">
            {langs.map((lang) => (
              <div
                key={lang.name}
                style={{
                  width: `${lang.percent}%`,
                  backgroundColor: languageColor(lang.name),
                }}
                title={`${lang.name} — ${lang.count} repos`}
              />
            ))}
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {langs.map((lang) => (
              <li
                key={lang.name}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: languageColor(lang.name) }}
                />
                <span className="truncate">{lang.name}</span>
                <span className="ml-auto text-muted-foreground">
                  {lang.percent.toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
