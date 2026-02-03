import { getAuthState } from '@/actions/get-auth-state'
import { SummaryInformation } from '@/components/home/summary-information'
import { Button } from '@/components/ui/button'
import { getFinancialSummary } from '@/http/api'
import { redirect } from 'next/navigation'

export default async function Home() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  const { monthExpense, monthIncome, totalBalance } =
    await getFinancialSummary()

  return (
    <div className="w-full">
      <header className="lg-gap-0 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="mb-4 text-3xl font-bold">Visão Geral Financeira</h1>
          <p className="text-muted-foreground font-medium">
            Bem-vindo de volta, aqui está o seu resumo financeiro.
          </p>
        </div>
        <Button>+ Adicionat Transação</Button>
      </header>
      <div>
        <SummaryInformation
          monthExpense={monthExpense}
          monthIncome={monthIncome}
          totalBalance={totalBalance}
        />
      </div>
    </div>
  )
}
