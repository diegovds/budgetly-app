import { getAuthState } from '@/actions/get-auth-state'
import { ChartArea } from '@/components/dashboard/area-chart'
import { CategoryGrid } from '@/components/dashboard/category-grid'
import { ChartBar } from '@/components/dashboard/chart-bar'
import { ChartPieDonutText } from '@/components/dashboard/chart-pie-donut-text'
import { HeaderPage } from '@/components/header-page'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Dashboard() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  return (
    <div className="w-full space-y-8">
      <HeaderPage
        buttonText="Voltar para a Home"
        description="Sua saúde financeira, tendências de renda e hábitos de gasto em resumo."
        href="/"
        title="Relatórios Financeiros"
        icon={false}
      />

      <ChartArea />

      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <ChartBar />
        <ChartPieDonutText />
      </div>

      <div className="grid w-full items-start gap-8 lg:grid-cols-2">
        <div className="bg-card w-full space-y-4 rounded-xl border p-5 pb-0">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp className="size-4 text-emerald-400" />
            </div>
            <h3 className="font-semibold">Desempenho das Receitas</h3>
          </div>
          <CategoryGrid type="INCOME" />
        </div>

        <div className="bg-card w-full space-y-4 rounded-xl border p-5 pb-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-destructive/10 flex size-8 items-center justify-center rounded-lg">
              <TrendingDown className="text-destructive size-4" />
            </div>
            <h3 className="font-semibold">Desempenho das Despesas</h3>
          </div>
          <CategoryGrid type="EXPENSE" />
        </div>
      </div>
    </div>
  )
}
