import { getAuthState } from '@/actions/get-auth-state'
import { HeaderPage } from '@/components/header-page'
import { MyAccounts } from '@/components/home/my-accounts'
import { MyTransactions } from '@/components/home/my-transactions'
import { SummaryInformation } from '@/components/home/summary-information'
import {
  getAccount,
  getAccountTypes,
  getCategory,
  getTransactionsSummary,
} from '@/http/api'
import { StoreAccounts } from '@/providers/store-account'
import { StoreAccountTypes } from '@/providers/store-account-type'
import { StoreCategories } from '@/providers/store-category'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Home | Budgetly',
}

export default async function Home() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  const categoriesData = getCategory({ orderBy: 'total' })
  const transactionsData = getTransactionsSummary()

  const accountsTrData = getAccount({ limit: 50 })
  const categoriesTrData = getCategory({ limit: 50 })
  const accountTypesData = getAccountTypes()

  const [categories, transactions, accountsTr, categoriesTr, accountTypes] =
    await Promise.all([
      categoriesData,
      transactionsData,
      accountsTrData,
      categoriesTrData,
      accountTypesData,
    ])

  return (
    <div className="w-full space-y-8">
      <StoreAccounts accounts={accountsTr.accounts} />
      <StoreCategories categories={categoriesTr.categories} />
      <StoreAccountTypes accountTypes={accountTypes} />

      <HeaderPage
        buttonText="Adicionar Transação"
        description="Bem-vindo de volta, aqui está o seu resumo financeiro."
        href="/transaction/new"
        title="Visão Geral Financeira"
      />
      <SummaryInformation />
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <MyAccounts />
        {categories.categories.length === 0 ? (
          <div className="flex-2 p-4" />
        ) : (
          <MyTransactions
            categories={categories.categories}
            transactions={transactions.transactions}
          />
        )}
      </div>
    </div>
  )
}
