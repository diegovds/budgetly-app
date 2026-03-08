'use client'

import { SearchParams } from '@/app/transaction/page'
import { getTransactions, GetTransactions200 } from '@/http/api'
import { formatCurrency, formatDate } from '@/utils/format'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type TransactionGridProps = {
  transactions: GetTransactions200
  searchParams: SearchParams
}

export function TransactionGrid({
  searchParams,
  transactions,
}: TransactionGridProps) {
  const [page, setPage] = useState(transactions.meta.page)

  const { data } = useQuery<GetTransactions200>({
    queryKey: ['transactions', searchParams, transactions, page],
    queryFn: () =>
      getTransactions({
        limit: transactions.meta.limit,
        page,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        accountId: searchParams.accountId,
        categoryId: searchParams.categoryId,
        search: searchParams.search,
      }),
    initialData: {
      transactions: transactions.transactions,
      meta: transactions.meta,
    },
    placeholderData: (previousData) => previousData,
  })

  const currentMeta = data.meta
  const start = (currentMeta.page - 1) * currentMeta.limit + 1
  const end = Math.min(currentMeta.page * currentMeta.limit, currentMeta.total)

  return (
    <div className="bg-card divide-accent divide-y overflow-x-auto rounded-md border">
      {/* Header */}
      <div className="grid min-w-225 grid-cols-[120px_2fr_1.5fr_1.5fr_1fr] p-4 text-sm font-semibold md:text-base">
        <p>Data</p>
        <p>Descrição</p>
        <p>Categoria</p>
        <p>Conta</p>
        <p>Valor</p>
      </div>

      {/* Body */}
      <ul className="divide-accent min-w-225 divide-y text-sm md:text-base">
        {data.transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="grid grid-cols-[120px_2fr_1.5fr_1.5fr_1fr] items-center p-4"
          >
            <p className="text-muted-foreground">
              {formatDate(new Date(transaction.date))}
            </p>
            <p className="truncate font-semibold">{transaction.description}</p>
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
  )
}
