'use client'

import { GetAccount200AccountsItem } from '@/http/api'
import { GetAccountTypes200Item } from '@/http/api'
import { GetCategory200CategoriesItem } from '@/http/api'
import { GetCategoryTypes200Item } from '@/http/api'
import { useAccountsStore } from '@/store/account'
import { useAccountTypesStore } from '@/store/account-type'
import { useCategoriesStore } from '@/store/categories'
import { useCategoryTypesStore } from '@/store/category-type'
import { useRef } from 'react'

type Props = {
  accounts: GetAccount200AccountsItem[]
  categories: GetCategory200CategoriesItem[]
  categoryTypes: GetCategoryTypes200Item[]
  accountTypes: GetAccountTypes200Item[]
}

export function StoreInitializer({
  accounts,
  categories,
  categoryTypes,
  accountTypes,
}: Props) {
  const initialized = useRef(false)

  if (!initialized.current) {
    useAccountsStore.getState().setAccounts(accounts)
    useCategoriesStore.getState().setCategories(categories)
    useCategoryTypesStore.getState().setCategoryTypes(categoryTypes)
    useAccountTypesStore.getState().setAccountTypes(accountTypes)
    initialized.current = true
  }

  return null
}
