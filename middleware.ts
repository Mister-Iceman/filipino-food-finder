import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

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
  const wordpressPatterns = [
    '/restaurants/united-states/',
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

  // Protect /admin routes with Supabase session check
  if (pathname.startsWith('/admin')) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
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