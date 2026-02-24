import { getAuthState } from '@/actions/get-auth-state'
import { MyAccounts } from '@/components/home/my-accounts'
import { MyTransactions } from '@/components/home/my-transactions'
import { SummaryInformation } from '@/components/home/summary-information'
import { Button } from '@/components/ui/button'
import {
  getAccount,
  getCategory,
  getFinancialSummary,
  getTransactionsSummary,
} from '@/http/api'
import { CirclePlus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Home | Budgetly',
}

export default async function Home() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  const financialSummaryData = getFinancialSummary()
  const accountsData = getAccount({ limit: 4 })
  const categoriesData = getCategory()
  const transactionsData = getTransactionsSummary()

  const [financialSummary, accounts, categories, transactions] =
    await Promise.all([
      financialSummaryData,
      accountsData,
      categoriesData,
      transactionsData,
    ])

  return (
    <div className="w-full space-y-8">
      <header className="lg-gap-0 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="mb-4 text-3xl font-bold">Visão Geral Financeira</h1>
          <p className="text-muted-foreground font-medium">
            Bem-vindo de volta, aqui está o seu resumo financeiro.
          </p>
        </div>
        <Link href="/transaction/new">
          <Button className="w-fit">
            <CirclePlus /> Adicionar Transação
          </Button>
        </Link>
      </header>
      <SummaryInformation
        monthExpense={financialSummary.monthExpense}
        monthIncome={financialSummary.monthIncome}
        totalBalance={financialSummary.totalBalance}
      />
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <MyAccounts
          accounts={accounts.accounts}
          totalBalance={financialSummary.totalBalance}
        />
        <MyTransactions
          categories={categories.categories}
          transactions={transactions.transactions}
        />
      </div>
    </div>
  )
}
