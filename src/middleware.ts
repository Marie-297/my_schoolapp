import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPrivateRoute = createRouteMatcher([ '/admin(.*)', '/student(.*)', '/teacher(.*)', '/parent(.*)'])

export default clerkMiddleware(async (auth, request) => {
  if (request.url.startsWith("/api/webhook")) {
    return;
  }
  if (isPrivateRoute(request)) {
    await auth.protect()
  }
})
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};