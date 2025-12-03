import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TOKEN_COOKIE_NAME = 'auth_token'

// Routes that require authentication
const protectedRoutes = ['/products', '/onboarding']

// Routes that should redirect to products if already authenticated
const publicRoutes = ['/login']

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to products if accessing login with valid token
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/products', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
