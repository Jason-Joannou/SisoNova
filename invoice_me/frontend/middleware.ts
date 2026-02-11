import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { config as secrets } from './lib/secrets'

async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    secrets.SUPABASE_PROJECT_URL,
    secrets.SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  return { response, supabase, user }
}

export async function middleware(request: NextRequest) {
  // IMPORTANT: Skip callback route entirely - let it handle auth client-side
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return NextResponse.next()
  }

  const { response, user } = await updateSession(request)

  // Define your protected routes
  const protectedPaths = ['/dashboard', '/profile', '/settings']
  const authPaths = ['/login', '/register']
  
  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )
  
  const isAuthRoute = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}