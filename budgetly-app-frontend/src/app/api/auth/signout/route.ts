import { clearServerAuthToken } from '@/lib/server-cookies'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  await clearServerAuthToken()
  return NextResponse.redirect(new URL('/login', request.url))
}
