# Security

OctoTrace is a frontend-only application with no backend and no database. This
document describes the authentication flow, what is stored where, and the
trade-offs of the chosen design.

## What Is Stored, and Where

| Item                  | Location                  | Notes                                            |
| --------------------- | ------------------------- | ------------------------------------------------ |
| GitHub access token   | Browser `localStorage`    | The only persisted user data. Cleared on logout. |
| OAuth `state` (CSRF)  | Browser `sessionStorage`  | Short-lived, per auth attempt.                   |
| OAuth client ID       | Client bundle (`NEXT_PUBLIC_`) | Public by design.                           |
| OAuth client secret   | Server env only           | Read only in the token-exchange Route Handler.   |

Nothing is stored on a server. There is no database.

## Authentication Flow (GitHub OAuth App)

1. **Authorize.** The browser redirects to
   `https://github.com/login/oauth/authorize` with `client_id`, `redirect_uri`,
   `scope`, and a random `state` saved to `sessionStorage`.
2. **Callback.** GitHub redirects to `/auth/callback?code=...&state=...`. The
   callback page verifies the returned `state` matches the stored one (CSRF guard).
3. **Token exchange.** The callback POSTs the `code` to the app's own
   `POST /api/auth/token` Route Handler.
4. **Server exchange.** The Route Handler calls
   `https://github.com/login/oauth/access_token` with the `code` and the
   `GITHUB_CLIENT_SECRET`, and returns `{ access_token }`.
5. **Store + use.** The browser stores the token in `localStorage` and calls the
   GitHub REST API directly with `Authorization: Bearer <token>`.

### Why a server hop is required

The token exchange cannot happen in the browser for two reasons:
- The client secret must never be shipped to the client.
- GitHub's `access_token` endpoint does not send CORS headers, so the browser
  cannot call it directly.

A single stateless Route Handler is the minimal server surface that satisfies both
constraints. The GitHub **REST API** (`api.github.com`), by contrast, does support
CORS, so all data fetching happens client-side without a proxy.

## Secrets Handling

- `GITHUB_CLIENT_SECRET` is read **only** in `src/app/api/auth/token/route.ts`.
- Never prefix a secret with `NEXT_PUBLIC_` — that embeds it in the client bundle.
- `.env` is git-ignored; only `.env.example` (placeholders) is committed.
- If a secret is ever exposed, rotate it in the GitHub OAuth App settings.

## OAuth Scopes

Default: `read:user user:email repo`.

- `repo` is required to read **private** repositories (GitHub has no read-only
  private-repo scope).
- Use `public_repo` instead if only public repositories need to be analyzed.
- Request the narrowest scope set that satisfies the features in use.

## Threat Model & Trade-offs

- **Token in `localStorage` is readable by JavaScript**, so it is exposed to XSS.
  This is an accepted trade-off for a personal, single-user, frontend-only app.
  Mitigations: never render untrusted HTML, keep dependencies patched, and request
  minimal scopes. A future hardening option is to move the token into an
  httpOnly cookie and proxy GitHub calls server-side.
- **CSRF** on the OAuth redirect is mitigated by the `state` parameter.
- **Revocation.** Users can revoke OctoTrace's access at any time from GitHub →
  Settings → Applications, independent of clearing the local token.

## User Controls

- **Logout** clears the access token from `localStorage`.
- **Revoke** access entirely from GitHub account settings.
- Because nothing is stored server-side, there is no server data to export or delete.
