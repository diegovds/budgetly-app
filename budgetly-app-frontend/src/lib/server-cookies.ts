import { cookies } from 'next/headers'

export const getServerAuthToken = async (): Promise<string | null> => {
  const cookiesStore = await cookies()
  return cookiesStore.get('auth_token')?.value ?? null
}

export const setServerAuthToken = async (token: string) => {
  const cookiesStore = await cookies()
  cookiesStore.set('auth_token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 dias em segundos
  })
}

export const clearServerAuthToken = async () => {
  const cookiesStore = await cookies()
  cookiesStore.delete('auth_token')
}
