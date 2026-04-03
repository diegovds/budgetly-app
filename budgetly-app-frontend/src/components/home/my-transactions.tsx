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
    <div className="flex-2 space-y-8">
      <div className="bg-card space-y-6 rounded p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">
            Grupos de Transações
          </h2>
          <Link href="/category" className="text-xs md:text-sm">
            Ver Tudo
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {!isLoadingCategories && categories
            ? categories.categories.map((category) => (
                <Category key={category.id} category={category} />
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-accent flex animate-pulse flex-col justify-between space-y-4 rounded p-4 text-transparent"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium md:text-xl">_</h3>
                    <Link href={`/transaction?categoryId=`}>
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs md:text-sm">Últimos 30 dias</p>
                    <span className={`text-base font-medium md:text-xl`}>
                      _
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </div>
      <div className="bg-card space-y-6 rounded p-4">
        <h2 className="text-xl font-semibold md:text-2xl">
          Transações Recentes
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {isLoadingTransactions ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-accent flex animate-pulse items-center justify-between rounded p-4 text-transparent"
              >
                <div className="flex-1 space-y-2">
                  <h3 className="text-base font-medium md:text-xl">_</h3>
                  <p className="text-xs md:text-sm">_</p>
                </div>
                <p
                  className={`flex-1 text-right text-sm font-semibold md:text-base`}
                >
                  _
                </p>
              </div>
            ))
          ) : transactions && transactions.transactions.length > 0 ? (
            transactions.transactions.map((transaction) => (
              <Transaction key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <p className="text-muted-foreground text-xs md:text-sm">
              Nenhuma Transação
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
