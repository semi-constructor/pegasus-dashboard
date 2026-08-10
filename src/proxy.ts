import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { locales, defaultLocale } from './i18n/config';

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;
  
  requestHeaders.set("x-pathname", pathname);

  // Exclude api, _next, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Check if the path starts with a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (!pathnameIsMissingLocale) {
    // Path has a locale (e.g., /de or /de/features)
    const locale = pathname.split('/')[1];
    
    // Create a rewrite to the actual path without locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    requestHeaders.set('x-next-locale', locale);
    
    return NextResponse.rewrite(new URL(pathWithoutLocale, request.url), {
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    // Path doesn't have a locale (e.g., /features), check cookie or use default
    let locale = request.cookies.get('NEXT_LOCALE')?.value;
    if (!locale || !locales.includes(locale as any)) {
      locale = defaultLocale;
    }
    requestHeaders.set('x-next-locale', locale);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
