import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const APP_ROUTES = [
  "/dashboard",
  "/send",
  "/receive",
  "/requests",
  "/history",
  "/transactions",
  "/merchant",
  "/settings",
];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value || "";
  const pathname = req.nextUrl.pathname;

  // If no token and trying to access app routes, redirect to login
  if (!token && APP_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // If token and trying to access auth routes, redirect to dashboard
  if (token && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/send/:path*",
    "/receive/:path*",
    "/requests/:path*",
    "/history/:path*",
    "/transactions/:path*",
    "/merchant/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
