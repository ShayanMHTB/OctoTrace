# Architecture

OctoTrace is a **frontend-only** GitHub analytics application. There is no backend
and no database. GitHub is the single source of truth, and all analytics data is
fetched live from the GitHub REST API directly in the browser.

## Guiding Principles

- **No server state.** Nothing about a user is persisted on any server.
- **GitHub-direct.** Repository, activity, and language data is read straight from
  the GitHub REST API client-side and cached in-session with SWR.
- **Minimal trust surface.** The only secret (the OAuth client secret) lives in a
  single server-side Route Handler and is never sent to the browser.
- **Privacy by construction.** The only thing stored in the browser is the GitHub
  access token (`localStorage`), which the user can clear at any time.

## Tech Stack

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Framework      | Next.js 15 (App Router), React 19, TypeScript      |
| Styling        | Tailwind CSS v4, shadcn/ui, Radix UI, Lucide       |
| Theming        | next-themes (class strategy)                        |
| Data fetching  | SWR (client-side, against GitHub REST API)         |
| Charts         | Recharts                                            |
| Tables         | @tanstack/react-table                              |
| Forms          | react-hook-form + zod                              |
| Package manager| pnpm                                               |
| Build/dev      | Turbopack                                          |

## High-Level Flow

```
Browser (React, client components)
  │
  ├── Login ──► GitHub OAuth authorize ──► /auth/callback?code,state
  │                                              │
  │                                              ▼
  │                                  POST /api/auth/token  ◄── only server-side code
  │                                  (exchanges code + secret for access_token)
  │                                              │
  │                          { access_token } ◄──┘
  │                                              │
  │                              localStorage ◄──┘
  │
  └── Authenticated data ──► https://api.github.com (Bearer token, CORS, client-side)
```

## Route Groups

- **`(public)/`** — marketing/landing pages, no auth. Public layout (Header/Footer).
- **`(dashboard)/`** — protected analytics pages behind a client-side auth guard.
- **`auth/`** — `/auth` (login) and `/auth/callback` (OAuth redirect handler).

## Authentication

Authorization Code grant via a GitHub **OAuth App**. See [SECURITY.md](SECURITY.md)
for the full flow, the reason a server hop is required, and the threat model.

Summary:
1. Browser redirects to GitHub's authorize endpoint with a CSRF `state`.
2. GitHub redirects back with a `code`.
3. The callback verifies `state` and POSTs the `code` to `/api/auth/token`.
4. The Route Handler exchanges it for an access token (holding the secret server-side).
5. The token is stored in `localStorage`; the app calls the GitHub API directly.

**Route protection is client-side** — the token lives in `localStorage`, which
Next.js middleware and Server Components cannot read, so the dashboard layout
guards access in the browser.

## Server-Side Code

The single server-side file:

```
src/app/api/auth/token/route.ts   # POST — OAuth code → access token exchange
```

No other server endpoints exist. Do not introduce a database, ORM, or backend
service; the app is intentionally serverless and stateless.

## Data Strategy

All data is read from the GitHub REST API at request time and cached in-session by
SWR. There is no cross-session persistence beyond the access token. Respect the
authenticated rate limit (5,000 requests/hour).
