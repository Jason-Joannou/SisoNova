// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TokenResponse } from "./lib/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function refreshAccessToken(): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

async function verifyToken(token: string): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  const protectedRoutes = ["/dashboard"];
  const authRoutes = ["/login", "/register"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Handle auth routes (login/register)
  if (isAuthRoute && accessToken) {
    console.log("Auth route with token, verifying...");
    const verifyResponse = await verifyToken(accessToken);

    if (verifyResponse.ok) {
      // Valid token - redirect to dashboard
      console.log("Valid token, redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (verifyResponse.status === 401) {
      // Try to refresh
      console.log("Token expired, trying to refresh...");
      const refreshResponse = await refreshAccessToken();

      if (refreshResponse.ok) {
        // Refresh successful - redirect to dashboard
        console.log("Refresh successful, redirecting to dashboard");

        return NextResponse.redirect(
          new URL("/dashboard", request.url)
        );
      }
    }

    // Token invalid or refresh failed - clear cookies and show login
    console.log("Token invalid, clearing cookies");
    const response = NextResponse.next();
    response.cookies.delete("access_token");
    return response;
  }

  // Allow access to auth routes without token
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute) {
    // No access token - redirect to login
    if (!accessToken) {
      console.log("No access token, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify access token
    console.log("Verifying access token...");
    const verifyResponse = await verifyToken(accessToken);

    if (verifyResponse.ok) {
      // Token valid - allow access
      console.log("Token valid, allowing access");
      return NextResponse.next();
    }

    // Token invalid/expired - try to refresh
    if (verifyResponse.status === 401) {
      console.log("Token expired, trying to refresh...");
      const refreshResponse = await refreshAccessToken();

      if (refreshResponse.ok) {
        // Refresh successful - set new tokens and allow access
        console.log("Refresh successful, setting new tokens");
        return NextResponse.next();
      }
    }

    // Token invalid or refresh failed - redirect to login
    console.log("Token invalid or refresh failed, redirecting to login");
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access_token");
    return response;
  }

  // Allow all other routes
  return NextResponse.next();
}

// THIS IS CRITICAL - Without this, middleware won't run!
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)",
  ],
};
