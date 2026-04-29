'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OAUTH_STATE_KEY, setToken } from '@/lib/auth';

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    // Guard against React Strict Mode running this effect twice — the OAuth
    // code is single-use, so a second exchange would always fail.
    if (ran.current) return;
    ran.current = true;

    const code = params.get('code');
    const returnedState = params.get('state');
    const oauthError = params.get('error_description') || params.get('error');

    if (oauthError) {
      setError(oauthError);
      return;
    }

    const savedState = sessionStorage.getItem(OAUTH_STATE_KEY);
    sessionStorage.removeItem(OAUTH_STATE_KEY);

    if (!code) {
      setError('No authorization code was returned by GitHub.');
      return;
    }
    if (!savedState || savedState !== returnedState) {
      setError('OAuth state mismatch. Please start the login again.');
      return;
    }

    (async () => {
      try {
        const res = await fetch('/api/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (!res.ok || !data.access_token) {
          throw new Error(data.error || 'Failed to exchange code for a token.');
        }
        setToken(data.access_token);
        router.replace('/dashboard');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Authentication failed.');
      }
    })();
  }, [params, router]);

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-4 text-center">
          <AlertCircle className="mx-auto size-8 text-destructive" />
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Sign-in failed</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/auth">Back to login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 p-8 text-muted-foreground">
      <Loader2 className="size-6 animate-spin" />
      <p className="text-sm">Completing sign-in…</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
