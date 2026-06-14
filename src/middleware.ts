import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes require the user to be logged in
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/visualize(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Redirect to sign-in if user is not authenticated
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run middleware on all routes except static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};