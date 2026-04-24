import { NextResponse } from 'next/server';

/**
 * The only server-side code in the app.
 *
 * Exchanges a GitHub OAuth authorization `code` for an access token. This must
 * run server-side because (1) it needs GITHUB_CLIENT_SECRET, which must never
 * reach the browser, and (2) GitHub's token endpoint does not send CORS headers,
 * so the browser cannot call it directly.
 */
export async function POST(request: Request) {
  let code: string | undefined;
  try {
    const body = await request.json();
    code = body?.code;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorization code.' },
      { status: 400 },
    );
  }

  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'GitHub OAuth is not configured on the server.' },
      { status: 500 },
    );
  }

  let data: {
    access_token?: string;
    error?: string;
    error_description?: string;
  };
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    data = await res.json();
  } catch {
    return NextResponse.json(
      { error: 'Failed to reach GitHub.' },
      { status: 502 },
    );
  }

  if (data.error) {
    return NextResponse.json(
      { error: data.error_description || data.error },
      { status: 400 },
    );
  }

  if (!data.access_token) {
    return NextResponse.json(
      { error: 'GitHub did not return an access token.' },
      { status: 502 },
    );
  }

  // Only the token is returned — never the client secret.
  return NextResponse.json({ access_token: data.access_token });
}
