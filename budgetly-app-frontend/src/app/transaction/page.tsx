import { getAuthState } from '@/actions/get-auth-state'
import { Pagination } from '@/components/pagination'
import { TransactionFilters } from '@/components/transaction/transaction-filters'
import { Button } from '@/components/ui/button'
import { getAccount, getCategory, getTransactions } from '@/http/api'
import { formatCurrency, formatDate } from '@/utils/format'
import { CirclePlus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Gestão de transações',
}

export type SearchParams = {
  page?: number
  startDate?: string
  endDate?: string
  accountId?: string
  categoryId?: string
  search?: string
}

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function TransactionPage({ searchParams }: Props) {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  const params = await searchParams

  const currentPage = params.page ?? 1

  const { meta, transactions } = await getTransactions({
    limit: 8,
    page: currentPage,
    startDate: params.startDate,
    endDate: params.endDate,
    accountId: params.accountId,
    categoryId: params.categoryId,
    search: params.search,
  })

  const { accounts } = await getAccount({ limit: 50 })
  const { categories } = await getCategory({ limit: 50 })

  return (
    <div className="w-full space-y-8">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
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
        params={params}
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
                className={`font-semibold ${
                  transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {formatCurrency(transaction.amount)}
              </p>
            </li>
          ))}
        </ul>
        <Pagination meta={meta} params={params} />
      </div>
    </div>
  )
}
