'use client'

import { getCategory, getTransactionsSummary } from '@/http/api'
import { useQueries } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Category } from './category'
import { Transaction } from './transaction'

export function MyTransactions() {
  const [
    { data: categories, isLoading: isLoadingCategories },
    { data: transactions, isLoading: isLoadingTransactions },
  ] = useQueries({
    queries: [
      {
        queryKey: ['my-transactions-categories'],
        queryFn: () => getCategory({ orderBy: 'total' }),
      },
      {
        queryKey: ['my-transactions-transactions'],
        queryFn: () => getTransactionsSummary(),
      },
    ],
  })

  return (
    <div className="flex-2 space-y-6">
      <div className="bg-card space-y-5 rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Grupos de Transações</h2>
          <Link
            href="/category"
            className="text-muted-foreground hover:text-primary text-xs transition-colors"
          >
            Ver tudo →
          </Link>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {!isLoadingCategories && categories
            ? categories.categories.map((category) => (
                <Category key={category.id} category={category} />
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-accent flex animate-pulse flex-col justify-between space-y-3 rounded-xl p-4 text-transparent"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">_</span>
                    <ChevronRight className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs">_</p>
                    <span className="text-base">_</span>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <div className="bg-card space-y-5 rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Transações Recentes</h2>
        <div className="space-y-2">
          {isLoadingTransactions ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-accent flex animate-pulse items-center justify-between rounded-lg p-3 text-transparent"
              >
                <div className="flex-1 space-y-1.5">
                  <p className="text-sm">_</p>
                  <p className="text-xs">_</p>
                </div>
                <p className="flex-1 text-right text-sm">_</p>
              </div>
            ))
          ) : transactions && transactions.transactions.length > 0 ? (
            transactions.transactions.map((transaction) => (
              <Transaction key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <p className="text-muted-foreground text-sm">Nenhuma Transação</p>
          )}
        </div>
      </div>
    </div>
  )
}
