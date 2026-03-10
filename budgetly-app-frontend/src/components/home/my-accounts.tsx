'use client'

import { useModalStore } from '@/store/useModalStore.ts'
import { formatCurrency } from '@/utils/format'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Account } from './account'

type MyAccountsProps = {
  accounts: {
    id: string
    name: string
    balance: number
  }[]
  totalBalance: number
}

export function MyAccounts({ accounts, totalBalance }: MyAccountsProps) {
  const { setIsOpen, setWhoOpened } = useModalStore()

  return (
    <div className="bg-accent flex-1 space-y-4 rounded p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">Minhas Contas</h2>
          <Link href="/account" className="text-xs md:text-sm">
            Ver Todas
          </Link>
        </div>
        <p className="text-muted-foreground text-xs md:text-sm">
          Total: {formatCurrency(totalBalance)}
        </p>
      </div>
      <div className="space-y-4">
        {accounts.map((account) => (
          <Account key={account.id} account={account} />
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
