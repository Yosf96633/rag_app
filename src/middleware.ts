import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET!

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret })
  const url = req.nextUrl.clone()
  const pathname = url.pathname

  // ✅ Guest-only pages
  const guestOnlyRoutes = ['/login', '/sign_up', '/admin/sign_up']

  // ✅ Auth-protected pages
  const protectedRoutes = ['/', '/admin/dashboard']

  // ✅ 1. Redirect logged-in users away from login/signup pages
  if (token && guestOnlyRoutes.includes(pathname)) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // ✅ 2. Redirect unauthenticated users from protected pages
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    // Important: prevent loop by not redirecting if already on /login
    if (pathname !== '/login') {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // ✅ 3. Admin-only access to /admin/dashboard/*
   if (pathname.startsWith('/admin/dashboard')) {
    if (!token) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const role = (token as any)?.user?.role

    if (role !== 'admin') {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}
export const config = {
  matcher: [
    '/',
    '/login',
    '/sign_up',
    '/admin/sign_up',
    '/admin/dashboard/:path*',
  ],
}
