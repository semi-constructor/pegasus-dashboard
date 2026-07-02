import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  // Force the original host so NextAuth infers the correct callback URL behind the tunnel
  requestHeaders.set("x-forwarded-host", "pegasus.cptcr.uk");
  requestHeaders.set("x-forwarded-proto", "https");

  // Only redirect to HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    const protocol = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol;
    if (protocol === 'http:' || protocol === 'http') {
      const url = request.nextUrl.clone();
      url.protocol = 'https:';
      url.port = '443';
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
