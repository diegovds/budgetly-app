'use client'

import { getAccount, GetAccount200 } from '@/http/api'
import { formatCurrency } from '@/utils/format'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../ui/button'

export function AccountGrid() {
  const [page, setPage] = useState(1)

  const { data } = useQuery<GetAccount200>({
    queryKey: ['accounts', page],
    queryFn: () => getAccount({ limit: 4, page }),
    placeholderData: (prev) => prev,
  })

  if (!data) return null

  const currentMeta = data.meta
  const start = (currentMeta.page - 1) * currentMeta.limit + 1
  const end = Math.min(currentMeta.page * currentMeta.limit, currentMeta.total)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
        {data.accounts.map((account) => (
          <div
            key={account.id}
            className="bg-accent flex items-end justify-between rounded p-4"
          >
            <div className="space-y-4">
              <div className="space-y-0.5">
                <h2 className="text-lg font-semibold md:text-xl">
                  {account.name}
                </h2>
                <p className="text-muted-foreground text-xs md:text-sm">
                  {account.type}
                </p>
              </div>
              <div className="space-y-0.5">
                <h2 className="text-muted-foreground text-sm font-semibold md:text-base">
                  Saldo atual
                </h2>
                <p
                  className={`text-2xl font-semibold md:text-3xl ${
                    account.balance >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {formatCurrency(account.balance)}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href={`/transaction?accountId=${account.id}`}>
                <Button variant="outline" className="text-xs md:text-sm">
                  Ver Transações
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <p className="text-xs md:text-sm">
          Mostrando {start} a {end} de um total de {currentMeta.total} Contas
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
