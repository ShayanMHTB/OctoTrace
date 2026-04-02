# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OctoTrace is a privacy-focused GitHub analytics platform built with Next.js 15, React 19, and TypeScript. It gives developers enhanced insight into their GitHub activity through polished visualizations and detailed analytics.

**This is a frontend-only application. There is no backend, no database, and nothing is persisted on any server.**

**Key Architecture:**
- Next.js App Router with route groups: `(public)`, `(dashboard)`, and `auth`
- **GitHub is the only data source.** All analytics data is fetched live from the GitHub REST API directly in the browser.
- **No backend / no database.** The only server-side code is a single stateless Route Handler used for the OAuth token exchange (it must hold the client secret; the browser cannot).
- Auth via a GitHub **OAuth App**. The resulting access token is stored in the browser's `localStorage`.
- shadcn/ui component library on Radix UI primitives
- Tailwind CSS v4 for styling
- **pnpm** is the package manager (not npm/yarn)

**Privacy-First Approach:**
- Nothing is stored on a server — there is no server to store it on.
- The GitHub access token lives only in the user's browser (`localStorage`).
- All analytics are fetched real-time from GitHub and held in memory / SWR cache for the session.
- The user can disconnect at any time by clearing the token (logout) or revoking access in their GitHub settings.

## Development Commands

> Use **pnpm**. The project uses Turbopack (`--turbopack`) for dev and build.

```bash
pnpm install         # Install dependencies
pnpm dev             # Start dev server with Turbopack (http://localhost:3000)
pnpm build           # Production build with Turbopack
pnpm start           # Start production server
pnpm lint            # Run ESLint (next/core-web-vitals + next/typescript)
```

## Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```env
# GitHub OAuth App credentials
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_oauth_app_client_id   # exposed to browser (safe)
GITHUB_CLIENT_SECRET=your_oauth_app_client_secret       # SERVER-ONLY — never prefix with NEXT_PUBLIC_

# Base URL of the app (used to build the OAuth redirect URI)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Security Notes:**
- NEVER commit `.env` (it is git-ignored). Only `.env.example` (placeholders) is tracked.
- `GITHUB_CLIENT_SECRET` must ONLY ever be read in server-side code (the token-exchange Route Handler). Never expose it to the client and never prefix it with `NEXT_PUBLIC_`.
- Anything prefixed `NEXT_PUBLIC_` is embedded in the client bundle — only put non-secret values there.

### Creating the GitHub OAuth App
1. Go to GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App.
2. Homepage URL: `http://localhost:3000`
3. Authorization callback URL: `http://localhost:3000/auth/callback`
4. Copy the Client ID and generate a Client Secret into `.env`.

## Authentication

**Flow (GitHub OAuth App, Authorization Code grant):**
1. User clicks "Login with GitHub" → browser redirects to `https://github.com/login/oauth/authorize` with `client_id`, `redirect_uri`, `scope`, and a random `state` (CSRF guard saved in `sessionStorage`).
2. GitHub redirects back to `/auth/callback?code=...&state=...`.
3. The callback page verifies `state`, then POSTs the `code` to the app's own Route Handler `POST /api/auth/token`.
4. The Route Handler (server-side) exchanges `code` + `GITHUB_CLIENT_SECRET` at `https://github.com/login/oauth/access_token` and returns `{ access_token }`. **This server hop is required because GitHub's token endpoint has no CORS and the secret must stay off the client.**
5. The browser stores the token in `localStorage` and redirects to `/dashboard`.
6. All subsequent GitHub data is fetched **directly from the browser** against `https://api.github.com` with `Authorization: Bearer <token>` (the GitHub REST API supports CORS for these requests).

**Route protection:** Because the token lives in `localStorage`, Next.js middleware / Server Components cannot see it. Route protection is therefore **client-side**: a guard in the dashboard layout redirects to `/auth` when no token is present.

**Logout:** clear the token from `localStorage` and redirect to `/auth`.

**Scopes:** default `read:user user:email repo` (`repo` is required to read **private** repositories; use `public_repo` for public-only).

## Data Fetching Strategy

All data comes from the GitHub REST API, fetched client-side:
- Authenticated user profile — `GET /user`
- Repositories — `GET /user/repos`
- Commit activity, language stats, topics, etc. — relevant GitHub REST endpoints

Use **SWR** for caching/revalidation within a session. Respect GitHub's authenticated rate limit (5,000 req/hour). There is no persistence between sessions beyond the token in `localStorage`.

## Project Structure

### Route Groups
1. **`(public)/`** — Marketing/landing pages (no auth). Landing, features, about, contact, FAQ. Uses public layout with Header/Footer.
2. **`(dashboard)/`** — Protected analytics pages (client-side auth guard). `/dashboard`, plus repos/languages/activity as they are built. Uses dashboard layout with sidebar.
3. **`auth/`** — Auth flow. `/auth` (login), `/auth/callback` (OAuth redirect handler).

### Component Organization
```
src/components/
├── auth/          # Auth components (LoginForm, guards)
├── blocks/        # Reusable building blocks (StatCard, etc.)
├── charts/        # Data visualization (Recharts)
├── layout/        # Header, Footer, DashboardHeader, DashboardSidebar
├── shared/        # Cross-cutting utilities (ThemeProvider, ThemeToggle)
├── tables/        # Data tables (@tanstack/react-table)
└── ui/            # shadcn/ui base components (edit via CLI, not by hand)
```

### Server-side code
The ONLY server-side code is the OAuth token-exchange Route Handler:
```
src/app/api/auth/token/route.ts   # POST: exchange OAuth code for access token (holds the secret)
```
Do not add a database, ORM, or other backend services. If a feature seems to need server state, reconsider — this app is intentionally serverless and stateless.

## TypeScript Configuration
- **Path alias:** `@/*` → `./src/*` (use for all imports; avoid relative paths)
- **Strict mode** enabled. All components and functions should be fully typed.

```typescript
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

## Key Technical Patterns

### 1. Server vs Client Components
- **Default:** Server Components.
- **Use Client Components (`'use client'`) when:** using hooks, browser events, context providers, browser APIs (incl. `localStorage`), or anything touching auth/token state.
- Anything reading the token or calling the GitHub API from the browser is a Client Component.

### 2. GitHub API access (client-side)
Call the GitHub REST API directly from the browser with the token attached. Centralize this in a small fetch wrapper (`src/lib/github.ts`) rather than scattering `fetch` calls. Example shape:
```typescript
const res = await fetch('https://api.github.com/user', {
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
});
```

### 3. Token-exchange Route Handler (the only server code)
```typescript
// src/app/api/auth/token/route.ts
export async function POST(request: Request) {
  const { code } = await request.json();
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET, // server-only
      code,
    }),
  });
  // return { access_token } or an error — never echo the secret
}
```

### 4. Styling with Tailwind
- Tailwind CSS v4. Use the `cn()` helper (`@/lib/utils`) for conditional classes.
- Dark mode via `next-themes` with the `class` strategy.

### 5. Data fetching with SWR
```typescript
import useSWR from 'swr';
const { data, error, isLoading } = useSWR('repos', () => github.getRepos(), {
  revalidateOnFocus: false,
});
```

## State Management
- **Local UI state:** `useState`
- **Server cache:** SWR for GitHub API data
- **Auth/token state:** `localStorage` via `src/lib/auth.ts` helpers / a `useAuth` hook
- **Global state:** Zustand is acceptable for app-wide UI/preferences if needed (keep it minimal)
- **URL state:** Next.js router for navigation and search params

## Important Files
- `src/lib/utils.ts` — `cn()` Tailwind class-merge helper
- `src/lib/providers.tsx` — client providers (ThemeProvider, TooltipProvider, Toaster)
- `src/lib/auth.ts` — token get/set/clear + `useAuth` hook
- `src/lib/github.ts` — authenticated GitHub REST API wrapper
- `src/app/api/auth/token/route.ts` — OAuth token-exchange handler (only server code)
- `src/components/auth/LoginForm.tsx` — starts the OAuth flow
- `src/app/auth/callback/page.tsx` — handles the OAuth redirect
- `src/hooks/useLocalStorage.ts` — persistent local storage hook
- `src/hooks/useMobile.ts` — mobile detection hook
- `docs/ARCHITECTURE.md` — architecture documentation
- `docs/SECURITY.md` — security notes

## Development Guidelines

### Adding New Pages
1. Create the page in the correct route group: `(public)`, `(dashboard)`, or `auth`.
2. For protected pages, rely on the dashboard layout's client-side auth guard.
3. Add navigation links to the appropriate layout component (Header or DashboardSidebar).

### Adding shadcn/ui Components
Use the CLI — do not hand-copy:
```bash
pnpm dlx shadcn@latest add <component-name>
```
Do not manually edit files in `src/components/ui/`.

### Working with Charts
- Charts use Recharts. Keep them theme-aware (light/dark) and provide accessible tooltips/labels.

## Security Best Practices
1. NEVER expose `GITHUB_CLIENT_SECRET` to the client; read it only in the Route Handler.
2. Never prefix a secret with `NEXT_PUBLIC_`.
3. Include and verify a `state` parameter in the OAuth flow (CSRF protection).
4. Request the narrowest scopes that satisfy the feature (prefer `public_repo` over `repo` when private data isn't needed).
5. Treat the `localStorage` token as XSS-sensitive — avoid injecting untrusted HTML; keep dependencies current.
6. Clear the token on logout; document that users can revoke access in GitHub settings.
7. Never commit `.env`.

## Common Pitfalls
1. **Don't add a backend or database** — this app is intentionally frontend-only.
2. **Don't expose the client secret** — server-side Route Handler only.
3. **Don't try to guard routes in Next middleware** — it can't read `localStorage`; guards are client-side.
4. **Don't manually edit shadcn/ui components** — use the CLI.
5. **Don't use npm/yarn** — use pnpm.
6. **Don't add `'use client'` unnecessarily** — keep Server Components where possible.
7. **Don't use relative import paths** — use the `@/*` alias.
8. **Don't skip TypeScript types** — everything should be typed.

## Useful Resources
- [Next.js App Router](https://nextjs.org/docs/app)
- [GitHub REST API](https://docs.github.com/en/rest)
- [GitHub OAuth Apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
