import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Proxy (Next.js 16 — replaces middleware.js)
 *
 * Performs optimistic authentication checks on the edge.
 * Redirects unauthenticated users away from protected routes
 * and authenticated users away from the login page.
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Get the NextAuth session token from the cookie
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // Protected routes — require authentication
  const protectedRoutes = ["/board"];
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Public-only routes — redirect away if already authenticated
  const publicOnlyRoutes = ["/login"];
  const isPublicOnlyRoute = publicOnlyRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login to board
  if (isPublicOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/board", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes — NextAuth handles its own auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
