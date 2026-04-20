'use client'

import { getUserStats, GetUserStats200 } from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import { CreditCard, Layers, TrendingDown, TrendingUp } from 'lucide-react'
import { StatCard } from './stat-card'

export function UserStats() {
  const { data, isLoading } = useQuery<GetUserStats200>({
    queryKey: ['user-stats'],
    queryFn: () => getUserStats(),
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      <StatCard
        icon={<Layers size={20} />}
        label="Transações"
        value={data?.transactionsCount ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={<CreditCard size={20} />}
        label="Contas"
        value={data?.accountsCount ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={<TrendingUp size={20} />}
        label="Categorias de Receita"
        value={data?.incomeCategoriesCount ?? 0}
        isLoading={isLoading}
        variant="income"
      />
      <StatCard
        icon={<TrendingDown size={20} />}
        label="Categorias de Despesa"
        value={data?.expenseCategoriesCount ?? 0}
        isLoading={isLoading}
        variant="expense"
      />
    </div>
  )
}
