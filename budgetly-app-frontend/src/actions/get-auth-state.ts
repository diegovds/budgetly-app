'use server'

import { getServerAuthToken } from '@/lib/server-cookies'

export const getAuthState = async () => {
  const token = await getServerAuthToken()
  return { token }
}
