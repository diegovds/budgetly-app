import { getAuthState } from '@/actions/get-auth-state'
import { env } from '@/env'

export const customFetch = async <T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> => {
  const baseUrl = env.NEXT_PUBLIC_BACKEND_URL
  const { token } = await getAuthState()

  const url =
    typeof input === 'string'
      ? `${baseUrl}${input}`
      : `${baseUrl}${input.toString()}`

  const headersObj: Record<string, string> = {
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  if (init?.headers) {
    Object.assign(headersObj, init.headers)
  }

  if (init?.body) {
    headersObj['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    ...init,
    headers: headersObj,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message ?? `HTTP error ${response.status}`)
  }

  return data
}
