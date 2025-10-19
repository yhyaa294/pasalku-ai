import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next()

  // Add security headers
  const headers = response.headers

  // ✅ Fix: Add x-content-type-options header
  headers.set('X-Content-Type-Options', 'nosniff')

  // ✅ Fix: Remove x-xss-protection (deprecated, use CSP instead)
  headers.delete('X-XSS-Protection')

  // Add Content Security Policy
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://vercel.live;"
  )

  // Add Referrer Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Add Permissions Policy
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  // ✅ Fix: Add cache-control for static resources
  if (
    request.nextUrl.pathname.startsWith('/_next/static') ||
    request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot)$/)
  ) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  // Add charset to content-type
  const contentType = headers.get('Content-Type')
  if (contentType && contentType.includes('text/html') && !contentType.includes('charset')) {
    headers.set('Content-Type', `${contentType}; charset=utf-8`)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/image|favicon.ico).*)',
  ],
}
