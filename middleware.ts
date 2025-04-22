import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the current path is the root path
  if (request.nextUrl.pathname === "/") {
    // Redirect to your desired path
    return NextResponse.redirect(new URL("/busines", request.url));
  }

  // Return NextResponse.next() for all other paths
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: "/",
};
