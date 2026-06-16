'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const RepoGalaxy = dynamic(
  () => import('@/components/dashboard/RepoGalaxy'),
  {
    ssr: false,
    loading: () => (
      <div className="flex size-full items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    ),
  },
);

export default function GalaxyPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Repo Galaxy</h1>
        <p className="text-sm text-muted-foreground">
          Every repository as a star — sized by stars, colored by language,
          clustered by stack. Drag to orbit, hover for details, click to open.
        </p>
      </div>
      <div className="h-[72vh] overflow-hidden rounded-2xl border bg-[#05060a]">
        <RepoGalaxy />
      </div>
    </div>
  );
}
