'use client'

import { GetAccountTypes200Item } from '@/http/api'
import { useAccountTypesStore } from '@/store/account-type'
import { useEffect } from 'react'

type Props = {
  accountTypes: GetAccountTypes200Item[] | []
}

export const StoreAccountTypes = ({ accountTypes }: Props) => {
  const { setAccountTypes } = useAccountTypesStore()

  useEffect(() => {
    setAccountTypes(accountTypes)
  }, [setAccountTypes, accountTypes])

  return null
}
