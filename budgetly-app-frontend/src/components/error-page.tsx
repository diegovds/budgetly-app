'use client'

import { clearAuthCookie } from '@/actions/clear-auth-cookie'
import { useAccountsStore } from '@/store/account'
import { useAccountTypesStore } from '@/store/account-type'
import { useAuthStore } from '@/store/auth'
import { useCategoriesStore } from '@/store/categories'
import { useCategoryTypesStore } from '@/store/category-type'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ErrorPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { clearToken } = useAuthStore()
  const { clearAccounts } = useAccountsStore()
  const { clearAccountTypes } = useAccountTypesStore()
  const { clearCategories } = useCategoriesStore()
  const { clearCategoryTypes } = useCategoryTypesStore()

  useEffect(() => {
    async function handleError() {
      await clearAuthCookie()
      clearToken()
      clearAccounts()
      clearAccountTypes()
      clearCategories()
      clearCategoryTypes()
      queryClient.clear()
      router.push('/login')
    }

    handleError()
  }, [
    clearToken,
    queryClient,
    router,
    clearAccounts,
    clearAccountTypes,
    clearCategories,
    clearCategoryTypes,
  ])

  return null
}
