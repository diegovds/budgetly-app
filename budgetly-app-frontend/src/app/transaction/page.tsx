import { getAuthState } from '@/actions/get-auth-state'
import { HeaderPage } from '@/components/header-page'
import { TransactionFilters } from '@/components/transaction/transaction-filters'
import { TransactionGrid } from '@/components/transaction/transaction-grid'
import {
  getAccount,
  getAccountTypes,
  getCategory,
  getCategoryTypes,
} from '@/http/api'
import { StoreAccounts } from '@/providers/store-account'
import { StoreAccountTypes } from '@/providers/store-account-type'
import { StoreCategories } from '@/providers/store-category'
import { StoreCategoryTypes } from '@/providers/store-category-type'
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

  const accountsData = getAccount({ limit: 50 })
  const categoriesData = getCategory({ limit: 50 })
  const categoryTypesData = getCategoryTypes()
  const accountTypesData = getAccountTypes()

  const [accounts, categories, categoryTypes, accountTypes] = await Promise.all(
    [accountsData, categoriesData, categoryTypesData, accountTypesData],
  )

  return (
    <div className="w-full space-y-8">
      <StoreAccounts accounts={accounts.accounts} />
      <StoreCategories categories={categories.categories} />
      <StoreCategoryTypes categoryTypes={categoryTypes} />
      <StoreAccountTypes accountTypes={accountTypes} />

      <HeaderPage
        buttonText="Adicionar Transação"
        description="Visualize e gerencie todas as suas atividades financeiras."
        href="/transaction/new"
        title="Gestão de Transações"
      />

      <TransactionFilters
        key={`${params.startDate ?? ''}-${params.endDate ?? ''}-${params.accountId ?? ''}-${params.categoryId ?? ''}-${params.search ?? ''}`}
        accounts={accounts.accounts}
        categories={categories.categories}
        params={params}
      />

      <TransactionGrid searchParams={params} />
    </div>
  )
}
