'use client'

import { getAccount, getFinancialSummary } from '@/http/api'
import { useModalStore } from '@/store/useModalStore.ts'
import { formatCurrency } from '@/utils/format'
import { useQueries } from '@tanstack/react-query'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Account } from './account'

export function MyAccounts() {
  const { setIsOpen, setWhoOpened } = useModalStore()

  const [
    { data: accounts, isLoading: isLoadingAccounts },
    { data: totalBalance, isLoading: isLoadingTotalBalance },
  ] = useQueries({
    queries: [
      {
        queryKey: ['my-accounts-accounts'],
        queryFn: () => getAccount({ limit: 4 }),
      },
      {
        queryKey: ['summary-information'],
        queryFn: () => getFinancialSummary(),
      },
    ],
  })

  return (
    <div className="bg-card flex-1 space-y-4 rounded-xl border p-5">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Minhas Contas</h2>
          <Link
            href="/account"
            className="text-muted-foreground hover:text-primary text-xs transition-colors"
          >
            Ver tudo →
          </Link>
        </div>
        <p
          className={`text-muted-foreground text-xs ${isLoadingTotalBalance ? 'bg-accent animate-pulse rounded text-transparent' : ''}`}
        >
          Total:{' '}
          {!isLoadingTotalBalance && totalBalance
            ? formatCurrency(totalBalance.totalBalance)
            : '_'}
        </p>
      </div>

      <div className="space-y-2">
        {!isLoadingAccounts && accounts
          ? accounts.accounts.map((account) => (
              <Account key={account.id} account={account} />
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-accent flex animate-pulse items-center justify-between rounded-lg p-3 text-transparent"
              >
                <span className="text-sm">_</span>
                <span className="text-sm">_</span>
              </div>
            ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5 text-xs"
        onClick={() => {
          setIsOpen(true)
          setWhoOpened('/account/new')
        }}
      >
        <CirclePlus className="size-3.5" /> Adicionar Conta
      </Button>
    </div>
  )
}
