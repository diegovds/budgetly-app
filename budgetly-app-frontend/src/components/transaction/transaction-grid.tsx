'use client'

import { SearchParams } from '@/app/transaction/page'
import { getTransactions, GetTransactions200 } from '@/http/api'
import { useModalStore } from '@/store/useModalStore.ts'
import { formatCurrency, formatDate } from '@/utils/format'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Ellipsis } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { TablePagination } from '../table-pagination'
import { Badge } from '../ui/badge'

type TransactionGridProps = {
  searchParams: SearchParams
}

export function TransactionGrid({ searchParams }: TransactionGridProps) {
  const { setElement, setWhoOpened, setIsOpen } = useModalStore()
  const [page, setPage] = useState(1)
  useEffect(() => {
    setPage(1)
  }, [
    searchParams.startDate,
    searchParams.endDate,
    searchParams.accountId,
    searchParams.categoryId,
    searchParams.search,
  ])

  const { data, isPlaceholderData, isError, error } = useQuery<
    GetTransactions200,
    Error
  >({
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
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (isError) {
      toast.error('Erro ao buscar transações.')
    }
  }, [isError, error])

  if (!data)
    return (
      <div className="bg-card overflow-x-auto rounded-xl border">
        {/* Header */}
        <div className="bg-muted/30 grid min-w-3xl grid-cols-[0.1fr_120px_2fr_1.5fr_1.5fr_1fr] gap-4 px-4 py-3">
          <div className="invisible flex justify-between gap-4">
            <Ellipsis size={15} />
          </div>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Data</p>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Descrição</p>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Categoria</p>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Conta</p>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Valor</p>
        </div>

        {/* Body */}
        <ul className="divide-border/60 min-w-3xl divide-y text-sm">
          {Array.from({ length: 8 }).map((_, i) => (
            <li
              key={i}
              className="grid grid-cols-[0.1fr_120px_2fr_1.5fr_1.5fr_1fr] items-center gap-4 px-4 py-3.5"
            >
              <p className="bg-accent w-full animate-pulse rounded text-transparent">_</p>
              <p className="bg-accent w-full animate-pulse rounded text-transparent">_</p>
              <p className="bg-accent w-full animate-pulse rounded text-transparent">_</p>
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
          label="Transações"
          isLoading={true}
          className="border-border/60 min-w-3xl border-t px-4 pt-4 pb-5"
          onPrev={() => {}}
          onNext={() => {}}
        />
      </div>
    )

  const currentMeta = data.meta
  const start = (currentMeta.page - 1) * currentMeta.limit + 1
  const end = Math.min(currentMeta.page * currentMeta.limit, currentMeta.total)

  return (
    <div className="bg-card overflow-x-auto rounded-xl border">
      {/* Header */}
      <div className="bg-muted/30 grid min-w-3xl grid-cols-[0.1fr_120px_2fr_1.5fr_1.5fr_1fr] gap-4 px-4 py-3">
        <div className="invisible flex justify-between gap-4">
          <Ellipsis size={15} />
        </div>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Data</p>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Descrição</p>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Categoria</p>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Conta</p>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Valor</p>
      </div>

      {/* Body */}
      <ul className="divide-border/60 min-w-3xl divide-y text-sm">
        {data.transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="hover:bg-muted/20 grid grid-cols-[0.1fr_120px_2fr_1.5fr_1.5fr_1fr] items-center gap-4 px-4 py-3.5 transition-colors"
          >
            <div className="flex justify-between gap-4">
              <Ellipsis
                size={15}
                className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                onClick={() => {
                  setElement({ type: 'transaction', data: transaction })
                  setWhoOpened('transaction/delete')
                  setIsOpen(true)
                }}
              />
            </div>
            <p className="text-muted-foreground text-xs">
              {formatDate(new Date(transaction.date))}
            </p>
            <p className="truncate font-medium">{transaction.description}</p>
            <Badge variant="secondary" className="w-fit text-xs">{transaction.categoryName}</Badge>
            <p className="text-muted-foreground text-sm">{transaction.accountName}</p>
            <p
              className={`font-semibold ${
                transaction.type === 'INCOME' ? 'text-emerald-400' : 'text-destructive'
              }`}
            >
              {formatCurrency(transaction.amount)}
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
        label="Transações"
        isLoading={isPlaceholderData}
        className="border-border/60 min-w-3xl border-t px-4 pt-4 pb-5"
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  )
}
