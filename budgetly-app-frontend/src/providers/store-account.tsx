'use client'

import { GetAccount200AccountsItem } from '@/http/api'
import { useAccountsStore } from '@/store/account'
import { useEffect } from 'react'

type Props = {
  accounts: GetAccount200AccountsItem[] | []
}

export const StoreAccounts = ({ accounts }: Props) => {
  const { setAccounts } = useAccountsStore()

  useEffect(() => {
    setAccounts(accounts)
  }, [setAccounts, accounts])

  return null
}
