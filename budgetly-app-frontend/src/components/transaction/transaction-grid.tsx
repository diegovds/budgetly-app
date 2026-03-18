'use client'

import { SearchParams } from '@/app/transaction/page'
import { getTransactions, GetTransactions200 } from '@/http/api'
import { formatCurrency, formatDate } from '@/utils/format'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

type TransactionGridProps = {
  searchParams: SearchParams
}

export function TransactionGrid({ searchParams }: TransactionGridProps) {
  const [page, setPage] = useState(Number(searchParams.page ?? 1))

  useEffect(() => {
    setPage(1)
  }, [
    searchParams.startDate,
    searchParams.endDate,
    searchParams.accountId,
    searchParams.categoryId,
    searchParams.search,
  ])

  const { data } = useQuery<GetTransactions200>({
    queryKey: [
      'transactions',
      page,
      searchParams.startDate,
      searchParams.endDate,
      searchParams.accountId,
      searchParams.categoryId,
      searchParams.search,
    ],
    queryFn: () =>
      getTransactions({
        limit: 8,
        page,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        accountId: searchParams.accountId,
        categoryId: searchParams.categoryId,
        search: searchParams.search,
      }),
    placeholderData: (prev) => prev,
  })

  if (!data) return null

  const currentMeta = data.meta
  const start = (currentMeta.page - 1) * currentMeta.limit + 1
  const end = Math.min(currentMeta.page * currentMeta.limit, currentMeta.total)

  return (
    <div className="space-y-8">
      <div className="bg-card divide-accent divide-y overflow-x-auto rounded border">
        {/* Header */}
        <div className="grid min-w-2xl grid-cols-[120px_2fr_1.5fr_1.5fr_1fr] gap-4 p-4 text-sm font-semibold md:text-base">
          <p>Data</p>
          <p>Descrição</p>
          <p>Categoria</p>
          <p>Conta</p>
          <p>Valor</p>
        </div>

        {/* Body */}
        <ul className="divide-accent min-w-2xl divide-y text-sm md:text-base">
          {data.transactions.map((transaction) => (
            <li
              key={transaction.id}
              className="grid grid-cols-[120px_2fr_1.5fr_1.5fr_1fr] items-center gap-4 p-4"
            >
              <p className="text-muted-foreground">
                {formatDate(new Date(transaction.date))}
              </p>
              <p className="truncate font-semibold">
                {transaction.description}
              </p>
              <p className="w-fit rounded-xl border p-2 text-xs md:text-sm">
                {transaction.categoryName}
              </p>
              <p className="text-muted-foreground">{transaction.accountName}</p>
              <p
                className={`font-semibold ${
                  transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {formatCurrency(transaction.amount)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <p className="text-xs md:text-sm">
          Mostrando {start} a {end} de um total de {currentMeta.total}{' '}
          Transações
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
    </div>
  )
}
