'use client'

import { getAccount, GetAccount200 } from '@/http/api'
import { useModalStore } from '@/store/useModalStore.ts'
import { formatCurrency } from '@/utils/format'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Ellipsis } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { TablePagination } from '../table-pagination'
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
      <div className="bg-card rounded-xl border p-5 pb-0">
        <div className="grid gap-8 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-accent flex animate-pulse flex-col rounded-xl p-5 text-transparent"
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

        <TablePagination
          page={1}
          totalPages={2}
          total={0}
          start={0}
          end={0}
          label="Contas"
          isLoading={true}
          className="pt-4 pb-5"
          onPrev={() => {}}
          onNext={() => {}}
        />
      </div>
    )

  const currentMeta = data.meta
  const start = (currentMeta.page - 1) * currentMeta.limit + 1
  const end = Math.min(currentMeta.page * currentMeta.limit, currentMeta.total)

  return (
    <div className="bg-card rounded-xl border p-5 pb-0">
      <div className="grid gap-8 lg:grid-cols-2">
        {data.accounts.map((account) => (
          <div key={account.id} className="border-border/60 card-hover flex flex-col rounded-xl border p-5">
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
                    account.balance >= 0 ? 'text-emerald-400' : 'text-destructive'
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

      <TablePagination
        page={currentMeta.page}
        totalPages={currentMeta.totalPages}
        total={currentMeta.total}
        start={start}
        end={end}
        label="Contas"
        isLoading={isPlaceholderData}
        className="pt-4 pb-5"
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  )
}
