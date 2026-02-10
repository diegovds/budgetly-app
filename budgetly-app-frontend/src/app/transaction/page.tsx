import { getAuthState } from '@/actions/get-auth-state'
import { TransactionFilters } from '@/components/transaction/transaction-filters'
import { Button } from '@/components/ui/button'
import { getAccount, getCategory, getTransactions } from '@/http/api'
import { formatCurrency, formatDate } from '@/utils/format'
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Gestão de transações',
}

type SearchParams = {
  page?: number
  startDate?: string
  endDate?: string
  accountId?: string
  categoryId?: string
  search?: string
}

type Props = {
  searchParams: SearchParams
}

export default async function TransactionPage({ searchParams }: Props) {
  const { token } = await getAuthState()
  const _page = searchParams.page ? searchParams.page : 1

  if (!token) {
    redirect('/login')
  }

  const { meta, transactions } = await getTransactions({
    limit: 8,
    page: _page,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    accountId: searchParams.accountId,
    categoryId: searchParams.categoryId,
    search: searchParams.search,
  })

  const accounts = await getAccount()
  const { categories } = await getCategory({ limit: 50 })

  const start = (meta.page - 1) * meta.limit + 1
  const end = Math.min(meta.page * meta.limit, meta.total)

  const currentPage = meta.page
  const totalPages = meta.totalPages

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  const MAX_VISIBLE = 1

  const startPage = Math.max(1, currentPage - MAX_VISIBLE)
  const endPage = Math.min(totalPages, currentPage + MAX_VISIBLE)

  return (
    <div className="w-full space-y-8">
      <header className="lg-gap-0 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="mb-4 text-3xl font-bold">Gestão de Transações</h1>
          <p className="text-muted-foreground font-medium">
            Visualize e gerencie todas as suas atividades financeiras.
          </p>
        </div>
        <Link href="/transaction/new">
          <Button className="w-fit">
            <CirclePlus /> Adicionar Transação
          </Button>
        </Link>
      </header>

      <TransactionFilters
        accounts={accounts}
        categories={categories}
        page={_page}
      />

      <div className="bg-card space-y-4 overflow-x-auto rounded-md border">
        {/* Header */}
        <div className="grid min-w-225 grid-cols-[120px_2fr_1.5fr_1.5fr_1fr] border-b p-4 font-semibold">
          <p>Data</p>
          <p>Descrição</p>
          <p>Categoria</p>
          <p>Conta</p>
          <p>Valor</p>
        </div>

        {/* Body */}
        <ul className="min-w-225">
          {transactions.map((transaction) => (
            <li
              key={transaction.id}
              className="grid grid-cols-[120px_2fr_1.5fr_1.5fr_1fr] items-center border-b p-4"
            >
              <p className="text-muted-foreground">
                {formatDate(new Date(transaction.date))}
              </p>
              <p className="truncate font-semibold">
                {transaction.description}
              </p>
              <p className="w-fit rounded-xl border p-2 text-sm">
                {transaction.categoryName}
              </p>
              <p className="text-muted-foreground">{transaction.accountName}</p>
              <p
                className={`font-semibold ${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {formatCurrency(transaction.amount)}
              </p>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-4 px-4 pb-4 lg:flex-row">
          <p>
            Mostrando {start} a {end} de {meta.total} transações
          </p>

          <nav className="flex items-center gap-2">
            {/* Anterior */}
            {hasPrev ? (
              <Link href={`?page=${currentPage - 1}`}>
                <Button variant="outline">
                  <ChevronLeft />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                <ChevronLeft />
              </Button>
            )}

            {/* Página 1 */}
            <Link href="?page=1">
              <Button
                className={`rounded border px-3 py-1`}
                variant={currentPage === 1 ? 'default' : 'outline'}
              >
                1
              </Button>
            </Link>

            {/* Reticências à esquerda */}
            {startPage > 2 && <span className="px-2">…</span>}

            {/* Páginas intermediárias */}
            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i,
            )
              .filter((page) => page !== 1 && page !== totalPages)
              .map((page) => (
                <Link key={page} href={`?page=${page}`}>
                  <Button
                    className={`rounded px-3 py-1`}
                    variant={page === currentPage ? 'default' : 'outline'}
                  >
                    {page}
                  </Button>
                </Link>
              ))}

            {/* Reticências à direita */}
            {endPage < totalPages - 1 && <span className="px-2">…</span>}

            {/* Última página */}
            {totalPages > 1 && (
              <Link href={`?page=${totalPages}`}>
                <Button
                  className={`rounded px-3 py-1`}
                  variant={currentPage === totalPages ? 'default' : 'outline'}
                >
                  {totalPages}
                </Button>
              </Link>
            )}

            {/* Próxima */}
            {hasNext ? (
              <Link href={`?page=${currentPage + 1}`}>
                <Button variant="outline">
                  <ChevronRight />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                <ChevronRight />
              </Button>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
