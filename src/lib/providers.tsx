'use client';

import { useState, type ReactNode } from 'react';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { del, get, set } from 'idb-keyval';
import { clearToken } from '@/lib/auth';
import { GitHubError } from '@/lib/github';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const ONE_DAY = 1000 * 60 * 60 * 24;

function makeQueryClient() {
  return new QueryClient({
    // Any query failing with a 401 means the token is invalid/expired — clear
    // it and send the user back to sign in.
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof GitHubError && error.status === 401) {
          clearToken();
          if (
            typeof window !== 'undefined' &&
            window.location.pathname.startsWith('/dashboard')
          ) {
            window.location.href = '/auth';
          }
        }
      },
    }),
    defaultOptions: {
      queries: {
        // Considered fresh for 5 min; kept in (persisted) cache for a day.
        staleTime: 1000 * 60 * 5,
        gcTime: ONE_DAY,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * App-wide client providers. The TanStack Query cache is persisted to
 * IndexedDB (via idb-keyval) so GitHub data survives reloads while respecting
 * rate limits. idb-keyval's default store is created lazily on first
 * get/set/del call (client-only), so this is SSR-safe.
 */
export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  const [persister] = useState(() =>
    createAsyncStoragePersister({
      key: 'octotrace-query-cache',
      throttleTime: 1000,
      storage: {
        getItem: (key) => get(key),
        setItem: (key, value) => set(key, value),
        removeItem: (key) => del(key),
      },
    }),
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: ONE_DAY, buster: 'v1' }}
    >
      <TooltipProvider delayDuration={200}>
        {children}
        <Toaster richColors />
      </TooltipProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </PersistQueryClientProvider>
  );
}
