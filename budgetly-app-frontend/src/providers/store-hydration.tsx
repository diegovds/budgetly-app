'use client'

import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'

type Props = {
  token: string | null
}

export const StoreHydration = ({ token }: Props) => {
  const { setHydrated, setToken } = useAuthStore()

  useEffect(() => {
    if (token) setToken(token)
    setHydrated(true)
  }, [token, setHydrated, setToken])

  return null
}
