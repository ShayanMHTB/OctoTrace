'use client';

import SqlConsole from '@/components/dashboard/SqlConsole';

export default function SqlPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SQL Explorer</h1>
        <p className="text-sm text-muted-foreground">
          Query your GitHub data with SQL — joins, aggregations, anything —
          running entirely in your browser.
        </p>
      </div>
      <SqlConsole />
    </div>
  );
}
