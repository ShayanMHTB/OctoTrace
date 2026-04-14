'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/** localStorage key holding the GitHub access token. */
const TOKEN_KEY = 'octotrace.token';

/** sessionStorage key holding the per-attempt OAuth CSRF state. */
export const OAUTH_STATE_KEY = 'octotrace.oauth_state';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

/**
 * Client-side auth state. Reads the token from localStorage after mount
 * (so it never mismatches during SSR) and stays in sync across tabs.
 */
export function useAuth() {
  const router = useRouter();
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTokenState(getToken());
    setIsLoading(false);

    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) setTokenState(getToken());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    router.replace('/auth');
  }, [router]);

  return {
    token,
    isAuthenticated: Boolean(token),
    isLoading,
    logout,
  };
}
