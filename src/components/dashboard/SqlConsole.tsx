'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Play, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useContributions,
  useLanguageBytes,
  useRepos,
  useSnapshots,
} from '@/hooks/useGitHub';
import { loadWarehouse, runQuery, type QueryResult } from '@/lib/duckdb';

const SCHEMA = [
  { table: 'repos', columns: 'name, language, stars, forks, open_issues, size_kb, is_fork, is_archived, is_private, pushed_at' },
  { table: 'languages', columns: 'language, bytes, percent, repo_count' },
  { table: 'contributions', columns: 'date, count, weekday' },
  { table: 'snapshots', columns: 'date, stars, followers, following, repos, contributions' },
];

const SAMPLES = [
  {
    label: 'Top repos by stars',
    sql: 'SELECT name, stars, language\nFROM repos\nORDER BY stars DESC\nLIMIT 10;',
  },
  {
    label: 'Repos per language',
    sql: 'SELECT language, count(*) AS repos, sum(stars) AS stars\nFROM repos\nWHERE language IS NOT NULL\nGROUP BY language\nORDER BY repos DESC;',
  },
  {
    label: 'Busiest days',
    sql: 'SELECT date, count\nFROM contributions\nORDER BY count DESC\nLIMIT 10;',
  },
  {
    label: 'Bytes by language',
    sql: 'SELECT language, bytes\nFROM languages\nORDER BY bytes DESC\nLIMIT 10;',
  },
];

const DEFAULT_SQL = SAMPLES[1].sql;

function cell(value: unknown): string {
  if (value === null || value === undefined) return '∅';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

export default function SqlConsole() {
  const { data: repos } = useRepos();
  const langs = useLanguageBytes();
  const { data: contrib, isLoading: contribLoading } = useContributions();
  const { data: snapshots } = useSnapshots();

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const [sql, setSql] = useState(DEFAULT_SQL);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const dataReady =
    repos !== undefined && !langs.isPending && !contribLoading;

  useEffect(() => {
    if (startedRef.current || !dataReady) return;
    startedRef.current = true;

    const datasets = [];
    if (repos) {
      datasets.push({
        name: 'repos',
        rows: repos.map((r) => ({
          name: r.name,
          full_name: r.full_name,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
          open_issues: r.open_issues_count,
          watchers: r.watchers_count,
          size_kb: r.size,
          is_fork: r.fork,
          is_archived: r.archived,
          is_private: r.private,
          pushed_at: r.pushed_at,
          created_at: r.created_at,
        })),
      });
    }
    if (langs.languages.length) {
      datasets.push({
        name: 'languages',
        rows: langs.languages.map((l) => ({
          language: l.name,
          bytes: l.bytes,
          percent: l.percent,
          repo_count: l.repoCount,
        })),
      });
    }
    if (contrib) {
      datasets.push({
        name: 'contributions',
        rows: contrib.contributionCalendar.weeks
          .flatMap((w) => w.contributionDays)
          .map((d) => ({
            date: d.date,
            count: d.contributionCount,
            weekday: d.weekday,
          })),
      });
    }
    if (snapshots && snapshots.length > 0) {
      datasets.push({
        name: 'snapshots',
        rows: snapshots.map((s) => ({
          date: s.date,
          stars: s.stars ?? null,
          followers: s.followers ?? null,
          following: s.following ?? null,
          repos: s.repos ?? null,
          contributions: s.contributions ?? null,
        })),
      });
    }

    loadWarehouse(datasets)
      .then(() => setStatus('ready'))
      .catch((e) => {
        setLoadError(e instanceof Error ? e.message : String(e));
        setStatus('error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataReady]);

  const execute = async () => {
    if (status !== 'ready' || !sql.trim()) return;
    setRunning(true);
    setQueryError(null);
    try {
      setResult(await runQuery(sql));
    } catch (e) {
      setQueryError(e instanceof Error ? e.message : String(e));
      setResult(null);
    } finally {
      setRunning(false);
    }
  };

  if (status === 'loading') {
    return (
      <Card className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        <p className="text-sm">
          Preparing your in-browser data warehouse…
        </p>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card className="p-6 text-center text-sm text-muted-foreground">
        Couldn’t start DuckDB: {loadError}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        {/* Editor */}
        <Card className="flex flex-col gap-3 p-4">
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSql(s.sql)}
                className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {s.label}
              </button>
            ))}
          </div>
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) execute();
            }}
            spellCheck={false}
            rows={8}
            className="w-full resize-y rounded-lg border bg-muted/30 p-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              ⌘/Ctrl + Enter to run
            </span>
            <Button onClick={execute} disabled={running} size="sm">
              {running ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Play className="size-4" />
              )}
              Run
            </Button>
          </div>
        </Card>

        {/* Schema */}
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Tables</h3>
          <ul className="space-y-3">
            {SCHEMA.map((t) => (
              <li key={t.table} className="text-xs">
                <code className="font-medium text-[var(--brand-1)]">
                  {t.table}
                </code>
                <p className="mt-0.5 text-muted-foreground">{t.columns}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Results */}
      {queryError ? (
        <Card className="p-4 text-sm text-destructive">{queryError}</Card>
      ) : result ? (
        <Card className="overflow-hidden p-0">
          <div className="max-h-[28rem] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  {result.columns.map((c) => (
                    <TableHead key={c} className="whitespace-nowrap">
                      {c}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.rows.slice(0, 200).map((row, i) => (
                  <TableRow key={i}>
                    {result.columns.map((c) => (
                      <TableCell
                        key={c}
                        className="whitespace-nowrap tabular-nums"
                      >
                        {cell(row[c])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border-t px-4 py-2 text-xs text-muted-foreground">
            {result.rows.length.toLocaleString()} row
            {result.rows.length === 1 ? '' : 's'} · {result.ms} ms
            {result.rows.length > 200 && ' · showing first 200'}
          </div>
        </Card>
      ) : null}

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-[var(--brand-1)]" />
        Queries run entirely in your browser via DuckDB-WASM — your data is
        never sent anywhere.
      </p>
    </div>
  );
}
