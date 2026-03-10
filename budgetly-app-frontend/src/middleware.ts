import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getAuthState } from './actions/get-auth-state'

export async function middleware(req: NextRequest) {
  const { token } = await getAuthState()
  const { pathname } = req.nextUrl

  const publicRoutes = ['/login', '/register']
  const privateRoutes = [
    '/',
    '/transaction',
    '/account',
    '/category',
    '/dashboard',
  ]

  // usuário logado tentando acessar rota pública
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // usuário não logado tentando acessar rota privada
  if (!token && privateRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/transaction',
    '/account',
    '/category',
    '/dashboard',
  ],
}
