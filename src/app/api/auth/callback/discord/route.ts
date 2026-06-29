import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAppUrl } from '@/lib/api';

export async function GET(request: Request) {
  const envAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  const appUrl = envAppUrl ? envAppUrl.replace(/\/+$/, '') : await getAppUrl(request);
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?error=NoCode', appUrl));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/auth/callback/discord`;

  if (!clientId || !clientSecret) {
    console.error('Discord OAuth credentials missing in environment variables');
    return NextResponse.redirect(new URL('/dashboard?error=MissingCredentials', appUrl));
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Discord token exchange failed:', errorData);
      return NextResponse.redirect(new URL('/dashboard?error=TokenExchangeFailed', appUrl));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      const cookieStore = await cookies();
      cookieStore.set('discord_user', JSON.stringify(userData), {
        path: '/',
        maxAge: tokenData.expires_in || 604800,
      });
    }

    const cookieStore = await cookies();
    cookieStore.set('discord_access_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in || 604800,
    });

    return NextResponse.redirect(new URL('/dashboard', appUrl));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=CallbackException', appUrl));
  }
}
