'use client';

import RepoTable from '@/components/tables/RepoTable';
import RepoTreemap from '@/components/charts/RepoTreemap';

export default function ReposPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Repositories</h1>
        <p className="text-sm text-muted-foreground">
          Search, filter, and sort across every repository you own.
        </p>
      </div>
      <RepoTreemap />
      <RepoTable />
    </div>
  );
}
