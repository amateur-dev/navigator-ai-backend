import { authkitMiddleware } from '@workos-inc/authkit-nextjs'

// WorkOS AuthKit middleware handles authentication automatically
// In middlewareAuth mode, all routes are protected by default
// Add routes to unauthenticatedPaths to make them public
export default authkitMiddleware({
  middlewareAuth: {
    enabled: false,
    unauthenticatedPaths: [
      '/',
      '/about',
      '/blog/:path*',
      '/post/:path*',
      '/auth/sign-in',
      '/auth/sign-up',
      '/callback',
      '/assets/:path*'
    ]
  }
})

// The middleware must run on ALL routes where you call withAuth() or useAuth()
// This matcher excludes only static files and Next.js internals
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
