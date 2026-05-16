'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  ExternalLink,
  Search,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useRepos } from '@/hooks/useGitHub';
import type { GitHubRepo } from '@/lib/github';
import { languageColor } from '@/lib/language-colors';
import { cn } from '@/lib/utils';

const columnHelper = createColumnHelper<GitHubRepo>();

const columns = [
  columnHelper.accessor((r) => `${r.name} ${r.description ?? ''}`, {
    id: 'name',
    header: 'Repository',
    sortingFn: (a, b) => a.original.name.localeCompare(b.original.name),
    cell: ({ row }) => {
      const repo = row.original;
      return (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/repos/${repo.full_name}`}
              className="truncate font-medium hover:text-[var(--brand-1)]"
            >
              {repo.name}
            </Link>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              aria-label="Open on GitHub"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-3" />
            </a>
          </div>
          {repo.description && (
            <p className="line-clamp-1 max-w-md text-xs text-muted-foreground">
              {repo.description}
            </p>
          )}
          <div className="mt-1 flex flex-wrap gap-1">
            {repo.private && (
              <Badge variant="outline" className="h-5 text-[10px]">
                Private
              </Badge>
            )}
            {repo.fork && (
              <Badge variant="outline" className="h-5 text-[10px]">
                Fork
              </Badge>
            )}
            {repo.archived && (
              <Badge variant="secondary" className="h-5 text-[10px]">
                Archived
              </Badge>
            )}
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor('language', {
    header: 'Language',
    cell: ({ getValue }) => {
      const lang = getValue();
      if (!lang) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="flex items-center gap-2 whitespace-nowrap">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: languageColor(lang) }}
          />
          {lang}
        </span>
      );
    },
  }),
  columnHelper.accessor('stargazers_count', {
    header: 'Stars',
    cell: ({ getValue }) => getValue().toLocaleString(),
  }),
  columnHelper.accessor('forks_count', {
    header: 'Forks',
    cell: ({ getValue }) => getValue().toLocaleString(),
  }),
  columnHelper.accessor('open_issues_count', {
    header: 'Issues',
    cell: ({ getValue }) => getValue().toLocaleString(),
  }),
  columnHelper.accessor((r) => r.pushed_at ?? '', {
    id: 'pushed_at',
    header: 'Updated',
    cell: ({ row }) => {
      const pushed = row.original.pushed_at;
      return (
        <span className="whitespace-nowrap text-muted-foreground">
          {pushed
            ? formatDistanceToNow(new Date(pushed), { addSuffix: true })
            : '—'}
        </span>
      );
    },
  }),
];

const NUMERIC_COLUMNS = new Set([
  'stargazers_count',
  'forks_count',
  'open_issues_count',
]);

export default function RepoTable() {
  const { data: repos, isLoading } = useRepos();

  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('all');
  const [visibility, setVisibility] = useState('all');
  const [includeForks, setIncludeForks] = useState(true);
  const [includeArchived, setIncludeArchived] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'stargazers_count', desc: true },
  ]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    for (const r of repos ?? []) if (r.language) set.add(r.language);
    return [...set].sort();
  }, [repos]);

  const filtered = useMemo(() => {
    return (repos ?? []).filter((r) => {
      if (language !== 'all' && r.language !== language) return false;
      if (visibility === 'public' && r.private) return false;
      if (visibility === 'private' && !r.private) return false;
      if (!includeForks && r.fork) return false;
      if (!includeArchived && r.archived) return false;
      return true;
    });
  }, [repos, language, visibility, includeForks, includeArchived]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:min-w-64 sm:flex-none">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repositories…"
            className="pl-9"
          />
        </div>

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            {languages.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={visibility} onValueChange={setVisibility}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Switch
            id="forks"
            checked={includeForks}
            onCheckedChange={setIncludeForks}
          />
          <Label htmlFor="forks" className="text-sm text-muted-foreground">
            Forks
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="archived"
            checked={includeArchived}
            onCheckedChange={setIncludeArchived}
          />
          <Label htmlFor="archived" className="text-sm text-muted-foreground">
            Archived
          </Label>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => {
                    const numeric = NUMERIC_COLUMNS.has(header.column.id);
                    const sorted = header.column.getIsSorted();
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(numeric && 'text-right')}
                      >
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            'inline-flex items-center gap-1 hover:text-foreground',
                            numeric && 'flex-row-reverse',
                          )}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted === 'asc' ? (
                            <ArrowUp className="size-3.5" />
                          ) : sorted === 'desc' ? (
                            <ArrowDown className="size-3.5" />
                          ) : (
                            <ChevronsUpDown className="size-3.5 opacity-40" />
                          )}
                        </button>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No repositories match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'align-top',
                          NUMERIC_COLUMNS.has(cell.column.id) &&
                            'text-right tabular-nums',
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {!isLoading && (
        <p className="text-sm text-muted-foreground">
          {table.getRowModel().rows.length} of {repos?.length ?? 0} repositories
        </p>
      )}
    </div>
  );
}
