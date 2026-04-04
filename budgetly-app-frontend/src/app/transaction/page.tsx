import { getAuthState } from '@/actions/get-auth-state'
import { HeaderPage } from '@/components/header-page'
import { TransactionFilters } from '@/components/transaction/transaction-filters'
import { TransactionGrid } from '@/components/transaction/transaction-grid'
import { Metadata } from 'next'
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

  return (
    <div className="w-full space-y-8">
      <HeaderPage
        buttonText="Adicionar Transação"
        description="Visualize e gerencie todas as suas atividades financeiras."
        href="/transaction/new"
        title="Gestão de Transações"
      />

      <TransactionFilters
        key={`${params.startDate ?? ''}-${params.endDate ?? ''}-${params.accountId ?? ''}-${params.categoryId ?? ''}-${params.search ?? ''}`}
        params={params}
      />

      <TransactionGrid searchParams={params} />
    </div>
  )
}
