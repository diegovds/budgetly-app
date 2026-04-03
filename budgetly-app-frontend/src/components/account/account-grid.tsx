'use client'

import { getAccount, GetAccount200 } from '@/http/api'
import { useModalStore } from '@/store/useModalStore.ts'
import { formatCurrency } from '@/utils/format'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Ellipsis, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'

export function AccountGrid() {
  const { setElement, setWhoOpened, setIsOpen } = useModalStore()
  const [page, setPage] = useState(1)
  const { data, isPlaceholderData, isError, error } = useQuery<
    GetAccount200,
    Error
  >({
    queryKey: ['accounts', page],
    queryFn: () => getAccount({ limit: 4, page }),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (isError) {
      toast.error('Erro ao buscar contas.')
    }
  }, [isError, error])

  if (!data)
    return (
      <div className="bg-card space-y-6 rounded p-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-accent flex animate-pulse flex-col rounded p-4 text-transparent"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold md:text-xl">_</h2>
                <Ellipsis size={15} className="cursor-pointer" />
              </div>

              <p className="text-xs text-transparent md:text-sm">_</p>

              <div className="mt-4 flex items-end justify-between">
                <div className="space-y-0.5">
                  <h2 className="text-sm font-semibold text-transparent md:text-base">
                    Saldo atual
                  </h2>
                  <p className={`text-2xl font-semibold md:text-3xl`}>_</p>
                </div>
                <Link href={`/transaction?accountId=`}>
                  <Button
                    variant="outline"
                    className="invisible text-xs md:text-sm"
                  >
                    Ver Transações
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-accent flex animate-pulse flex-col items-center justify-between gap-4 text-transparent lg:flex-row">
          <p className="text-xs md:text-sm">Mostrando Contas</p>
          {isPlaceholderData ? (
            <Button variant="outline" className="invisible text-xs md:text-sm">
              <Loader2 className="animate-spin" />
            </Button>
          ) : (
            <div className="invisible flex items-center gap-2">
              <Button
                variant="outline"
                className="text-xs md:text-sm"
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft />
              </Button>

              <Button
                variant="outline"
                className="text-xs md:text-sm"
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      </div>
    )

  const currentMeta = data.meta
  const start = (currentMeta.page - 1) * currentMeta.limit + 1
  const end = Math.min(currentMeta.page * currentMeta.limit, currentMeta.total)

  return (
    <div className="bg-card space-y-6 rounded p-4">
      <div className="grid gap-8 lg:grid-cols-2">
        {data.accounts.map((account) => (
          <div key={account.id} className="bg-accent flex flex-col rounded p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold md:text-xl">
                {account.name}
              </h2>
              <Ellipsis
                size={15}
                className="cursor-pointer"
                onClick={() => {
                  setElement({ type: 'account', data: account })
                  setWhoOpened('account/manage')
                  setIsOpen(true)
                }}
              />
            </div>

            <p className="text-muted-foreground text-xs md:text-sm">
              {account.type}
            </p>

            <div className="mt-4 flex items-end justify-between">
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
        {currentMeta.totalPages > 1 ? (
          isPlaceholderData ? (
            <Button variant="outline" className="text-xs md:text-sm">
              <Loader2 className="animate-spin" />
            </Button>
          ) : (
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
          )
        ) : (
          <Button
            variant="outline"
            className="invisible text-xs md:text-sm"
            disabled={true}
          >
            <ChevronLeft />
          </Button>
        )}
      </div>
    </div>
  )
}
