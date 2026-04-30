'use client'

import {
  GetAccount200AccountsItem,
  GetAccountTypes200Item,
  GetCategory200CategoriesItem,
  GetCategoryTypes200Item,
} from '@/http/api'

import { useAccountsStore } from '@/store/account'
import { useAccountTypesStore } from '@/store/account-type'
import { useCategoriesStore } from '@/store/categories'
import { useCategoryTypesStore } from '@/store/category-type'
import { useEffect } from 'react'

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
  useEffect(() => {
    useAccountsStore.getState().setAccounts(accounts)
    useCategoriesStore.getState().setCategories(categories)
    useCategoryTypesStore.getState().setCategoryTypes(categoryTypes)
    useAccountTypesStore.getState().setAccountTypes(accountTypes)
  }, [accounts, categories, categoryTypes, accountTypes])

  return null
}
