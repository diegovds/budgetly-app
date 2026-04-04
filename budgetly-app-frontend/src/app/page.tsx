import { getAuthState } from '@/actions/get-auth-state'
import { HeaderPage } from '@/components/header-page'
import { MyAccounts } from '@/components/home/my-accounts'
import { MyTransactions } from '@/components/home/my-transactions'
import { SummaryInformation } from '@/components/home/summary-information'
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

  return (
    <div className="w-full space-y-8">
      <HeaderPage
        buttonText="Adicionar Transação"
        description="Bem-vindo de volta, aqui está o seu resumo financeiro."
        href="/transaction/new"
        title="Visão Geral Financeira"
      />
      <SummaryInformation />
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <MyAccounts />
        <MyTransactions />
      </div>
    </div>
  )
}
