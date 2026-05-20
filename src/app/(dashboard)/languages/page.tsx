'use client';

import { Code2, Layers, Trophy } from 'lucide-react';
import StatCard from '@/components/blocks/StatCard';
import LanguageDonut from '@/components/dashboard/LanguageDonut';
import LanguageBreakdown from '@/components/dashboard/LanguageBreakdown';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguageBytes } from '@/hooks/useGitHub';
import { formatBytes } from '@/utils/numbers';

export default function LanguagesPage() {
  const { languages, totalBytes, loaded, total, isPending } =
    useLanguageBytes();

  const hasData = languages.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Languages</h1>
        <p className="text-sm text-muted-foreground">
          A bytes-accurate breakdown of your stack across every repository.
          {isPending && total > 0 && (
            <span> Analyzing {loaded} of {total} repos…</span>
          )}
        </p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {hasData ? (
          <>
            <StatCard
              label="Total code"
              value={formatBytes(totalBytes)}
              icon={Code2}
            />
            <StatCard
              label="Languages"
              value={languages.length}
              icon={Layers}
            />
            <StatCard
              label="Primary"
              value={languages[0]?.name ?? '—'}
              icon={Trophy}
              hint={
                languages[0]
                  ? `${languages[0].percent.toFixed(0)}% of your code`
                  : undefined
              }
            />
          </>
        ) : (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="gap-0 p-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-8 w-20" />
            </Card>
          ))
        )}
      </div>

      {/* Donut + breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-2 font-semibold">Distribution by bytes</h3>
          {hasData ? (
            <LanguageDonut languages={languages} />
          ) : (
            <Skeleton className="mx-auto size-56 rounded-full" />
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold">All languages</h3>
          {hasData ? (
            <LanguageBreakdown languages={languages} />
          ) : (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
