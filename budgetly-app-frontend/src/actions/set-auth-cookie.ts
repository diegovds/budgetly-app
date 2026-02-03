'use server'

import { setServerAuthToken } from '@/lib/server-cookies'

export const setAuthCookie = async (token: string) => {
  await setServerAuthToken(token)
}
