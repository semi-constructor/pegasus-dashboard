import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAppUrl } from '@/lib/api';

export async function GET(request: Request) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'Discord Client ID not configured' }, { status: 500 });
  }

  const envAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  const appUrl = envAppUrl ? envAppUrl.replace(/\/+$/, '') : await getAppUrl(request);
  const redirectUri = `${appUrl}/api/auth/callback/discord`;

  const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=identify%20guilds`;

  const response = NextResponse.redirect(oauthUrl);
  try {
    const cookieStore = await cookies();
    cookieStore.set('oauth_app_url', appUrl, { path: '/', httpOnly: true, maxAge: 3600 });
  } catch (err) {
    console.error('Failed to set oauth_app_url cookie:', err);
  }

  return response;
}
