'use client'

import { getUserStats, GetUserStats200 } from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import { CreditCard, Layers, Tag } from 'lucide-react'

type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: number
  loading: boolean
}

function StatCard({ icon, label, value, loading }: StatCardProps) {
  return (
    <div className="bg-accent space-y-2 rounded p-4">
      <div className="text-muted-foreground flex items-center justify-between">
        <p className="text-sm font-semibold md:text-base">{label}</p>
        {icon}
      </div>
      {loading ? (
        <div className="bg-muted h-8 w-16 animate-pulse rounded" />
      ) : (
        <p className="text-2xl font-semibold md:text-3xl">{value}</p>
      )}
    </div>
  )
}

export function UserStats() {
  const { data, isLoading } = useQuery<GetUserStats200>({
    queryKey: ['user-stats'],
    queryFn: () => getUserStats(),
  })

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:gap-8">
      <StatCard
        icon={<Layers size={20} />}
        label="Transações"
        value={data?.transactionsCount ?? 0}
        loading={isLoading}
      />
      <StatCard
        icon={<CreditCard size={20} />}
        label="Contas"
        value={data?.accountsCount ?? 0}
        loading={isLoading}
      />
      <StatCard
        icon={<Tag size={20} />}
        label="Categorias"
        value={data?.categoriesCount ?? 0}
        loading={isLoading}
      />
    </div>
  )
}
