import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define the routes you want to protect
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/visualize(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|woff2?|csv|pdf|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};