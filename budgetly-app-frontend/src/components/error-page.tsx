'use client'

import { clearAuthCookie } from '@/actions/clear-auth-cookie'
import { useAuthStore } from '@/store/auth'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ErrorPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { clearToken } = useAuthStore()

  useEffect(() => {
    async function handleError() {
      await clearAuthCookie()
      clearToken()
      queryClient.clear()
      router.push('/login')
    }

    handleError()
  }, [clearToken, queryClient, router])

  return null
}
