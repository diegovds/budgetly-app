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
    <div className="bg-card grid gap-4 rounded p-4 md:grid-cols-3 lg:gap-8">
      <BalanceInformation
        balance={data?.totalBalance}
        icon={<Landmark size={20} />}
        text="Saldo Total"
        isLoading={isLoading}
      />
      <BalanceInformation
        balance={data?.monthIncome}
        icon={<Banknote size={20} />}
        text="Receitas do mês"
        isLoading={isLoading}
      />
      <BalanceInformation
        balance={data?.monthExpense}
        icon={<ShoppingCart size={20} />}
        text="Despesas do mês"
        isLoading={isLoading}
      />
    </div>
  )
}
