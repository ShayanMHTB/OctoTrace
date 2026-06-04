'use client';

import { ResponsiveChord } from '@nivo/chord';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguageMatrix } from '@/hooks/useGitHub';
import { languageColor } from '@/lib/language-colors';
import { nivoTheme } from '@/lib/nivo-theme';

export default function LanguageChord() {
  const { keys, matrix, ready } = useLanguageMatrix(8);

  return (
    <Card className="p-6">
      <h3 className="mb-1 font-semibold">Language pairings</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Which languages tend to live in the same repository.
      </p>
      <div className="h-96 w-full">
        {!ready ? (
          <Skeleton className="size-full rounded-lg" />
        ) : keys.length < 2 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            Not enough multi-language repositories to chart pairings.
          </div>
        ) : (
          <ResponsiveChord
            data={matrix}
            keys={keys}
            theme={nivoTheme}
            colors={keys.map((k) => languageColor(k))}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            padAngle={0.02}
            innerRadiusRatio={0.96}
            innerRadiusOffset={0.02}
            arcBorderWidth={0}
            ribbonOpacity={0.5}
            ribbonBorderWidth={0}
            labelTextColor="var(--muted-foreground)"
            animate={false}
          />
        )}
      </div>
    </Card>
  );
}
