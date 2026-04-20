'use client'

import { getFinancialSummary, GetFinancialSummary200 } from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import { Banknote, Landmark, ShoppingCart } from 'lucide-react'
import { BalanceInformation } from './balance-information'

export function SummaryInformation() {
  const { data, isLoading } = useQuery<GetFinancialSummary200>({
    queryKey: ['summary-information'],
    queryFn: () => getFinancialSummary(),
  })

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="animate-fade-in-up stagger-1">
        <BalanceInformation
          balance={data?.totalBalance}
          icon={<Landmark className="size-4" />}
          text="Saldo Total"
          isLoading={isLoading}
          variant="neutral"
        />
      </div>
      <div className="animate-fade-in-up stagger-2">
        <BalanceInformation
          balance={data?.monthIncome}
          icon={<Banknote className="size-4" />}
          text="Receitas do mês"
          isLoading={isLoading}
          variant="income"
        />
      </div>
      <div className="animate-fade-in-up stagger-3">
        <BalanceInformation
          balance={data?.monthExpense}
          icon={<ShoppingCart className="size-4" />}
          text="Despesas do mês"
          isLoading={isLoading}
          variant="expense"
        />
      </div>
    </div>
  )
}
