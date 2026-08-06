import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // We want to exclude /admin and /raffle-coming-soon from redirection
  const isExcludedPath = path.startsWith('/admin') || path.startsWith('/raffle-coming-soon');

  // We also don't want to redirect Next.js internal paths, static assets, and api routes.
  // The matcher in the config object usually handles this, but it's good to be safe.
  const isPublicAsset = path.startsWith('/_next') || path.startsWith('/api') || path.includes('.');

  if (isExcludedPath || isPublicAsset) {
    return NextResponse.next();
  }

  // Redirect everything else to /raffle-coming-soon
  return NextResponse.redirect(new URL('/raffle-coming-soon', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
