import { getAuthState } from '@/actions/get-auth-state'
import { ChartArea } from '@/components/dashboard/area-chart'
import { CategoryGrid } from '@/components/dashboard/category-grid'
import { ChartBar } from '@/components/dashboard/chart-bar'
import { ChartPieDonutText } from '@/components/dashboard/chart-pie-donut-text'
import { HeaderPage } from '@/components/header-page'
import { Card, CardTitle } from '@/components/ui/card'
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
        buttonText="Voltar para  a Home"
        description="Sua saúde financeira, tendências de renda e hábitos de gasto em resumo. "
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
        <Card className="overflow-x-auto rounded p-4">
          <CardTitle className="">Desempenho das Receitas</CardTitle>
          <CategoryGrid type="INCOME" />
        </Card>

        <Card className="overflow-x-auto rounded p-4">
          <CardTitle className="">Desempenho das Despesas</CardTitle>
          <CategoryGrid type="EXPENSE" />
        </Card>
      </div>
    </div>
  )
}
