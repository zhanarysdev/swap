import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the current path is the root path
  if (request.nextUrl.pathname === "/") {
    // Redirect to your desired path
    return NextResponse.redirect(new URL("/ads", request.url));
  }

  // Check if user is trying to access protected routes without authentication
  const token = request.cookies.get("token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

  // If accessing protected routes without token, redirect to login
  if (!token && !isLoginPage && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If accessing login page with valid token, redirect to main app
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/ads", request.url));
  }

  // Return NextResponse.next() for all other paths
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/", "/login", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
