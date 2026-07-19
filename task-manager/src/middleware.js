import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  // Real browser URLs needing user authentication
  const privatePaths = ["/organizations", "/mytasks", "/projects", "/members", "/roles"];
  const isPrivateRoute = privatePaths.some((path) => pathname.startsWith(path));

  // Real browser URLs accessible only if logged out
  const authPaths = ["/auth", "/forgot-password"];
  const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/organizations", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
