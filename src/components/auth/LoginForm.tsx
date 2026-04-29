'use client';

import { Github } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { OAUTH_STATE_KEY } from '@/lib/auth';

/** Scopes requested from GitHub. `repo` is needed to read private repos. */
const SCOPE = 'read:user user:email repo';

export default function LoginForm() {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) {
      toast.error('GitHub OAuth is not configured. Set NEXT_PUBLIC_GITHUB_CLIENT_ID.');
      return;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const redirectUri = `${appUrl}/auth/callback`;

    // CSRF protection: random state echoed back by GitHub and verified on return.
    const state = crypto.randomUUID();
    sessionStorage.setItem(OAUTH_STATE_KEY, state);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: SCOPE,
      state,
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to OctoTrace</h1>
          <p className="text-sm text-muted-foreground">
            Connect your GitHub account to explore your analytics. Your data stays
            in your browser — nothing is stored on a server.
          </p>
        </div>

        <Button onClick={handleLogin} size="lg" className="w-full gap-2">
          <Github className="size-4" />
          Continue with GitHub
        </Button>

        <p className="text-xs text-muted-foreground">
          You can revoke access anytime from your GitHub settings.
        </p>
      </div>
    </div>
  );
}
