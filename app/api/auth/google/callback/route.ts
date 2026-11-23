import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const stateParam = searchParams.get('state');

  const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

  // Decode target redirect if provided
  let redirectTarget = '/?step=completed';
  if (stateParam) {
    try {
      const decoded = JSON.parse(Buffer.from(stateParam, 'base64').toString('utf8'));
      if (decoded.target && typeof decoded.target === 'string') {
        redirectTarget = decoded.target;
      }
    } catch {
      try {
        const decoded = JSON.parse(Buffer.from(stateParam, 'base64url').toString('utf8'));
        if (decoded.target && typeof decoded.target === 'string') {
          redirectTarget = decoded.target;
        }
      } catch {
        // ignore state decode error
      }
    }
  }

  if (error) {
    return NextResponse.redirect(new URL(`/?step=verify&error=${encodeURIComponent(error)}`, origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?step=verify&error=missing_code', origin));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL('/?step=verify&error=google_credentials_not_configured', origin)
    );
  }

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;

    // 1. Exchange authorization code for tokens
    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResp.ok) {
      const errText = await tokenResp.text();
      return NextResponse.redirect(
        new URL(`/?step=verify&error=${encodeURIComponent('Token exchange failed: ' + errText)}`, origin)
      );
    }

    const tokenData = await tokenResp.json();
    let googleId = '';
    let email = '';
    let name = '';
    let picture = '';

    // Verify ID Token or fetch userinfo
    if (tokenData.id_token) {
      try {
        const verifyResp = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokenData.id_token)}`
        );
        if (verifyResp.ok) {
          const payload = await verifyResp.json();
          googleId = payload.sub || '';
          email = payload.email || '';
          name = payload.name || payload.given_name || (email ? email.split('@')[0] : '');
          picture = payload.picture || '';
        }
      } catch {
        // ignore ID token verification error
      }
    }

    if (!email && tokenData.access_token) {
      try {
        const userinfoResp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        if (userinfoResp.ok) {
          const payload = await userinfoResp.json();
          googleId = payload.sub || googleId;
          email = payload.email || '';
          name = payload.name || (email ? email.split('@')[0] : '');
          picture = payload.picture || picture;
        }
      } catch {
        // ignore userinfo error
      }
    }

    if (!email) {
      return NextResponse.redirect(
        new URL('/?step=verify&error=could_not_retrieve_profile', origin)
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name || cleanEmail.split('@')[0];

    const targetUrl = new URL(redirectTarget.startsWith('http') ? redirectTarget : `${origin}${redirectTarget.startsWith('/') ? '' : '/'}${redirectTarget}`);
    targetUrl.searchParams.set('google_auth', 'success');
    targetUrl.searchParams.set('email', cleanEmail);
    targetUrl.searchParams.set('name', cleanName);
    if (picture) targetUrl.searchParams.set('avatarUrl', picture);
    targetUrl.searchParams.set('step', 'completed');

    const profilePayload = {
      email: cleanEmail,
      ownerName: cleanName,
      avatarUrl: picture,
      phone: '',
      name: '',
      authProvider: 'google',
      googleId,
    };

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OQ - Authenticating...</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #090d16;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    .card {
      text-align: center;
      padding: 2rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      max-width: 400px;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(56, 189, 248, 0.2);
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h3 style="margin: 0 0 0.5rem 0;">Signed in successfully</h3>
    <p style="margin: 0; color: #94a3b8; font-size: 0.875rem;">Entering your OQ workspace...</p>
  </div>
  <script>
    try {
      sessionStorage.setItem('oq_authenticated', 'true');
      localStorage.setItem('oq_active_profile', JSON.stringify(${JSON.stringify(profilePayload)}));
    } catch (e) {}
    window.location.replace(${JSON.stringify(targetUrl.toString())});
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err: any) {
    return NextResponse.redirect(
      new URL(`/?step=verify&error=${encodeURIComponent(err.message || 'Authentication error')}`, origin)
    );
  }
}
