'use server'

import { clearServerAuthToken } from '@/lib/server-cookies'

export const clearAuthCookie = async () => {
  await clearServerAuthToken()
}
