'use client'

import {
  getDashboardGetlistcategories,
  GetDashboardGetlistcategories200,
  GetDashboardGetlistcategories200Type,
} from '@/http/api'
import { formatCurrency } from '@/utils/format'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { TablePagination } from '../table-pagination'

type CategoryGridProps = {
  type: GetDashboardGetlistcategories200Type
}

export function CategoryGrid({ type }: CategoryGridProps) {
  const [page, setPage] = useState(1)
  const { data, isPlaceholderData, isError, error } =
    useQuery<GetDashboardGetlistcategories200>({
      queryKey: ['dashboard-categories', type, page],
      queryFn: () =>
        getDashboardGetlistcategories({
          type,
          limit: 5,
          page,
        }),
      placeholderData: keepPreviousData,
    })

  useEffect(() => {
    if (isError) {
      toast.error(
        `Erro ao buscar ${type === 'EXPENSE' ? 'despesas' : 'receitas'}`,
      )
    }
  }, [isError, error, type])

  if (!data)
    return (
      <div className="overflow-x-auto">
        <div className="bg-muted/30 grid min-w-sm grid-cols-[1.5fr_1fr_1fr] gap-4 px-4 py-3">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Categoria</p>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Valor</p>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Percentual</p>
        </div>
        <ul className="divide-border/60 min-w-sm divide-y text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="grid min-w-sm grid-cols-[1.5fr_1fr_1fr] items-center gap-4 px-4 py-3.5">
              <p className="bg-accent w-full animate-pulse rounded text-transparent">_</p>
              <p className="bg-accent w-full animate-pulse rounded text-transparent">_</p>
              <p className="bg-accent w-full animate-pulse rounded text-transparent">_</p>
            </li>
          ))}
        </ul>
        <TablePagination
          page={1}
          totalPages={2}
          total={0}
          start={0}
          end={0}
          label=""
          isLoading={true}
          className="border-border/60 min-w-sm border-t px-4 pt-4 pb-5"
          onPrev={() => {}}
          onNext={() => {}}
        />
      </div>
    )

  const currentMeta = data.meta
  const start = (currentMeta.page - 1) * currentMeta.limit + 1
  const end = Math.min(currentMeta.page * currentMeta.limit, currentMeta.total)

  return (
    <div className="overflow-x-auto">
      <div className="bg-muted/30 grid min-w-sm grid-cols-[1.5fr_1fr_1fr] gap-4 px-4 py-3">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Categoria</p>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Valor</p>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Percentual</p>
      </div>
      <ul className="divide-border/60 min-w-sm divide-y text-sm">
        {data.categories.map((category) => (
          <li
            key={category.id}
            className="hover:bg-muted/20 grid min-w-sm grid-cols-[1.5fr_1fr_1fr] items-center gap-4 px-4 py-3.5 transition-colors"
          >
            <h3 className="truncate font-medium">{category.name}</h3>
            <p
              className={`font-semibold ${
                type === 'INCOME' ? 'text-emerald-400' : 'text-destructive'
              }`}
            >
              {formatCurrency(category.total)}
            </p>
            <p className="text-muted-foreground font-medium">
              {category.percentage.toFixed(2)}%
            </p>
          </li>
        ))}
      </ul>
      <TablePagination
        page={currentMeta.page}
        totalPages={currentMeta.totalPages}
        total={currentMeta.total}
        start={start}
        end={end}
        label={data.label}
        isLoading={isPlaceholderData}
        className="border-border/60 min-w-sm border-t px-4 pt-4 pb-5"
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  )
}
