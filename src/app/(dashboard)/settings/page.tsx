'use client';

import { Download, LogOut, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { del } from 'idb-keyval';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import {
  setPreference,
  usePreferences,
  type DateRange,
} from '@/lib/preferences';

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { logout } = useAuth();
  const prefs = usePreferences();
  const queryClient = useQueryClient();

  const handleExport = () => {
    const all = queryClient
      .getQueryCache()
      .getAll()
      .map((q) => ({ queryKey: q.queryKey, data: q.state.data }));
    const blob = new Blob([JSON.stringify(all, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `octotrace-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported your cached data.');
  };

  const handleClear = async () => {
    queryClient.clear();
    await del('octotrace-query-cache');
    toast.success('Cleared cached data — it will refresh from GitHub.');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Customize OctoTrace and manage your data.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold">Appearance</h2>
        <div className="divide-y">
          <Row title="Theme" description="Switch between light, dark, and system.">
            <ThemeToggle />
          </Row>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold">Preferences</h2>
        <div className="divide-y">
          <Row
            title="Default date range"
            description="Applied to time-based charts where supported."
          >
            <Select
              value={prefs.dateRange}
              onValueChange={(v) => setPreference('dateRange', v as DateRange)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold">Data &amp; privacy</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          OctoTrace stores nothing on a server. Your GitHub data lives only in
          this browser&apos;s cache, and your token in localStorage.
        </p>
        <div className="mt-2 divide-y">
          <Row
            title="Export cached data"
            description="Download everything currently cached as JSON."
          >
            <Button variant="outline" onClick={handleExport}>
              <Download className="size-4" />
              Export
            </Button>
          </Row>
          <Row
            title="Clear cached data"
            description="Wipe the local cache. Data re-fetches from GitHub."
          >
            <Button variant="outline" onClick={handleClear}>
              <Trash2 className="size-4" />
              Clear cache
            </Button>
          </Row>
          <Row
            title="Sign out"
            description="Remove your token from this browser."
          >
            <Button variant="destructive" onClick={logout}>
              <LogOut className="size-4" />
              Sign out
            </Button>
          </Row>
        </div>
      </Card>
    </div>
  );
}
