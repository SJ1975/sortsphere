// proxy.ts

import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  const isProtectedRoute =
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/visualize' ||
    pathname.startsWith('/visualize/');

  if (isProtectedRoute) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match application routes while excluding:
     * - Next.js internals
     * - static/public files
     * - common image, font, document, and script assets
     */
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|woff2?|csv|pdf|zip|webmanifest)).*)',
  ],
};