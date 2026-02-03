import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getAuthState } from './actions/get-auth-state'

export async function middleware(req: NextRequest) {
  const { token } = await getAuthState()
  const { pathname } = req.nextUrl

  // rotas públicas
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // rota privada raiz
  if (!token && pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/register'],
}
