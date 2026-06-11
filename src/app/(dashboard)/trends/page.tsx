'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Camera, TrendingUp } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import SnapshotTrend from '@/components/charts/SnapshotTrend';
import LanguageDriftStream from '@/components/charts/LanguageDriftStream';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  useContributions,
  useLanguageBytes,
  useRepos,
  useSnapshots,
  useViewer,
} from '@/hooks/useGitHub';
import { aggregateRepoStats } from '@/lib/github-stats';
import { captureSnapshot, type Snapshot } from '@/lib/snapshots';

export default function TrendsPage() {
  const queryClient = useQueryClient();
  const { data: viewer } = useViewer();
  const { data: repos } = useRepos();
  const { data: contrib } = useContributions();
  const langs = useLanguageBytes();
  const { data: snapshots = [] } = useSnapshots();

  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['snapshots'] }),
    [queryClient],
  );

  const buildMetrics = useCallback((): Omit<Partial<Snapshot>, 'date'> => {
    const metrics: Omit<Partial<Snapshot>, 'date'> = {};
    if (repos) {
      metrics.stars = aggregateRepoStats(repos).totalStars;
      metrics.repos = repos.length;
    }
    if (viewer) {
      metrics.followers = viewer.followers;
      metrics.following = viewer.following;
    }
    if (contrib) {
      metrics.contributions = contrib.contributionCalendar.totalContributions;
    }
    if (langs.languages.length) {
      metrics.languages = Object.fromEntries(
        langs.languages.map((l) => [l.name, l.bytes]),
      );
    }
    return metrics;
  }, [repos, viewer, contrib, langs.languages]);

  // Auto-capture once per visit when the core data is ready.
  const capturedRef = useRef(false);
  useEffect(() => {
    if (capturedRef.current) return;
    if (!viewer || !repos || !contrib) return;
    capturedRef.current = true;
    captureSnapshot(buildMetrics()).then(refresh);
  }, [viewer, repos, contrib, buildMetrics, refresh]);

  const captureNow = async () => {
    await captureSnapshot(buildMetrics());
    await refresh();
    toast.success('Snapshot captured.');
  };

  const starsData = snapshots
    .filter((s) => s.stars !== undefined)
    .map((s) => ({ date: s.date, value: s.stars! }));
  const followersData = snapshots
    .filter((s) => s.followers !== undefined)
    .map((s) => ({ date: s.date, value: s.followers! }));

  const sparse = snapshots.length < 2;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trends</h1>
          <p className="text-sm text-muted-foreground">
            History GitHub doesn’t keep — captured locally each time you visit.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={captureNow}>
          <Camera className="size-4" />
          Capture now
        </Button>
      </div>

      {sparse && (
        <Card className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
          <TrendingUp className="size-5 shrink-0 text-[var(--brand-1)]" />
          <p>
            Trends build up over time. You have {snapshots.length} snapshot
            {snapshots.length === 1 ? '' : 's'} so far — come back over the
            coming days and watch the lines grow.
          </p>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Stars over time</h3>
          <SnapshotTrend data={starsData} />
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Followers over time</h3>
          <SnapshotTrend data={followersData} color="var(--brand-3)" />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-1 font-semibold">Language drift</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          How your language mix shifts across snapshots.
        </p>
        <LanguageDriftStream snapshots={snapshots} />
      </Card>
    </div>
  );
}
