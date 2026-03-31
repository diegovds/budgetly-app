'use client'

import { GetUserStats200 } from '@/http/api'
import { CreditCard, Layers, TrendingDown, TrendingUp } from 'lucide-react'

type UserStatsProps = {
  data: GetUserStats200
}

type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: number
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-accent space-y-2 rounded p-4">
      <div className="text-muted-foreground flex items-center justify-between">
        <p className="text-sm font-semibold md:text-base">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-semibold md:text-3xl">{value}</p>
    </div>
  )
}

export function UserStats({ data }: UserStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      <StatCard
        icon={<Layers size={20} />}
        label="Transações"
        value={data?.transactionsCount ?? 0}
      />
      <StatCard
        icon={<CreditCard size={20} />}
        label="Contas"
        value={data?.accountsCount ?? 0}
      />
      <StatCard
        icon={<TrendingUp size={20} />}
        label="Categorias de Receita"
        value={data?.incomeCategoriesCount ?? 0}
      />
      <StatCard
        icon={<TrendingDown size={20} />}
        label="Categorias de Despesa"
        value={data?.expenseCategoriesCount ?? 0}
      />
    </div>
  )
}
