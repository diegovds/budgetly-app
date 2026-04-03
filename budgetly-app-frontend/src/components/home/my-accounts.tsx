'use client'

import {
  getAccount,
  GetAccount200,
  getFinancialSummary,
  GetFinancialSummary200,
} from '@/http/api'
import { useModalStore } from '@/store/useModalStore.ts'
import { formatCurrency } from '@/utils/format'
import { useQuery } from '@tanstack/react-query'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Account } from './account'

export function MyAccounts() {
  const { setIsOpen, setWhoOpened } = useModalStore()

  const { data: accounts, isLoading: isLoadingAccounts } =
    useQuery<GetAccount200>({
      queryKey: ['my-accounts-accounts'],
      queryFn: () => getAccount({ limit: 4 }),
    })

  const { data: totalBalance, isLoading: isLoadingTotalBalance } =
    useQuery<GetFinancialSummary200>({
      queryKey: ['my-accounts-totalBalance'],
      queryFn: () => getFinancialSummary(),
    })

  return (
    <div className="bg-card flex-1 space-y-4 rounded p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">Minhas Contas</h2>
          <Link href="/account" className="text-xs md:text-sm">
            Ver Tudo
          </Link>
        </div>
        <p
          className={`text-muted-foreground text-xs md:text-sm ${isLoadingTotalBalance && 'bg-accent animate-pulse rounded text-transparent'}`}
        >
          Total:{' '}
          {!isLoadingTotalBalance && totalBalance
            ? formatCurrency(totalBalance.totalBalance)
            : '_'}
        </p>
      </div>
      <div className="space-y-4">
        {!isLoadingAccounts && accounts
          ? accounts.accounts.map((account) => (
              <Account key={account.id} account={account} />
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-accent flex animate-pulse items-center justify-between rounded p-4 text-transparent"
              >
                <h3 className="text-sm font-medium md:text-base">_</h3>
                <p className={`text-sm font-semibold md:text-base`}>_</p>
              </div>
            ))}
      </div>

      <Button
        variant="outline"
        className="text-xs md:text-sm"
        onClick={() => {
          setIsOpen(true)
          setWhoOpened('/account/new')
        }}
      >
        <CirclePlus /> Adicionar Conta
      </Button>
    </div>
  )
}
