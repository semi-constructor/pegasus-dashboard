import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
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
  return NextResponse.next();
}
