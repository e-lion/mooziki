import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  const url = new URL(request.url)
  const path = url.pathname

  // 1. Redirect unauthenticated users to login, except for public paths
  if (!user && (path.startsWith('/dj') || path.startsWith('/attendee'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Role-Based Access Control (RBAC)
  if (user) {
    const role = user.user_metadata?.role || 'attendee'
    
    // Prevent attendees from accessing DJ routes
    if (role === 'attendee' && path.startsWith('/dj')) {
      return NextResponse.redirect(new URL('/attendee', request.url))
    }
    
    // Prevent DJs from accessing attendee routes
    if (role === 'dj' && path.startsWith('/attendee')) {
      return NextResponse.redirect(new URL('/dj', request.url))
    }

    // Redirect logged-in users away from login page to their respective dash
    if (path === '/login' || path === '/') {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
