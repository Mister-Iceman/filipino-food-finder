import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // List of old WordPress URLs that should return 410 Gone
  const wordpressCruft = [
    '/sample-page',
    '/register-2',
    '/login-2',
    '/reset-password',
    '/my-account',
    '/search-page',
    '/classifieds-archive-item',
    '/restaurants/category',
    '/tag',
    '/listing/custom-carpentry-services'
  ]

  // Check if the pathname starts with any of these patterns
  for (const cruft of wordpressCruft) {
    if (pathname.startsWith(cruft)) {
      // Return 410 Gone (permanent deletion)
      return new NextResponse(null, { status: 410 })
    }
  }

  // Check for any URLs containing WordPress patterns
  // Note: /restaurants/united-states/ is intentionally omitted — it is now
  // handled by a 301 redirect in next.config.ts so middleware must not 410 it.
  const wordpressPatterns = [
    '/restaurants/category/',
    '/tag/',
    '/listing/',
    '/classifieds-'
  ]

  for (const pattern of wordpressPatterns) {
    if (pathname.includes(pattern)) {
      // Return 410 Gone
      return new NextResponse(null, { status: 410 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}