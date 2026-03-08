'use client'

import {
  getDashboardGetlistcategories,
  GetDashboardGetlistcategories200,
  GetDashboardGetlistcategories200CategoriesItem,
  GetDashboardGetlistcategories200Meta,
  GetDashboardGetlistcategories200Type,
} from '@/http/api'
import { formatCurrency } from '@/utils/format'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

type CategoryGridProps = {
  categories: GetDashboardGetlistcategories200CategoriesItem[]
  meta: GetDashboardGetlistcategories200Meta
  type: GetDashboardGetlistcategories200Type
  label: string
}

export function CategoryGrid({
  categories,
  label,
  meta,
  type,
}: CategoryGridProps) {
  const [page, setPage] = useState(meta.page)

  const { data } = useQuery<GetDashboardGetlistcategories200>({
    queryKey: ['dashboard-categories', type, page],
    queryFn: () =>
      getDashboardGetlistcategories({
        type,
        limit: 5,
        page,
      }),
    initialData: {
      categories,
      label: '',
      type,
      meta,
    },
    placeholderData: (previousData) => previousData,
  })

  const currentMeta = data.meta
  const start = (currentMeta.page - 1) * currentMeta.limit + 1
  const end = Math.min(currentMeta.page * currentMeta.limit, currentMeta.total)

  return (
    <>
      <Card className="divide-accent gap-0 divide-y overflow-x-auto p-0">
        <div className="grid min-w-md grid-cols-[2fr_1.5fr_1fr] p-4 text-sm font-semibold md:text-base">
          <p>Categoria</p>
          <p>Valor</p>
          <p>Percentual</p>
        </div>
        <ul className="divide-accent divide-y text-sm md:text-base">
          {data.categories.map((category) => (
            <li
              key={category.id}
              className="grid min-w-md grid-cols-[2fr_1.5fr_1fr] items-center p-4"
            >
              <h3 className="truncate font-semibold">{category.name}</h3>
              <p
                className={`font-semibold ${
                  type === 'INCOME' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {formatCurrency(category.total)}
              </p>
              <p className="font-semibold">{category.percentage.toFixed(2)}%</p>
            </li>
          ))}
        </ul>
      </Card>
      <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <p className="text-xs md:text-sm">
          Mostrando de {start} a {end} em um total de {currentMeta.total}{' '}
          {label}
        </p>
        {currentMeta.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="text-xs md:text-sm"
              disabled={currentMeta.page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft />
            </Button>

            <Button
              variant="outline"
              className="text-xs md:text-sm"
              disabled={currentMeta.page === currentMeta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
