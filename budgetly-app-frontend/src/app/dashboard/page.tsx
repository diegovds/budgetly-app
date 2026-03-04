import { getAuthState } from '@/actions/get-auth-state'
import { ChartArea } from '@/components/dashboard/area-chart'
import { ChartBar } from '@/components/dashboard/chart-bar'
import { HeaderPage } from '@/components/header-page'
import {
  getDashboardBalancelastmonths,
  getDashboardLastmonthsincomeexpense,
} from '@/http/api'
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

  const balanceLastMonthsData = getDashboardBalancelastmonths()
  const dashboardLastMonthsIncomeExpenseData =
    getDashboardLastmonthsincomeexpense()

  const [balanceLastMonths, dashboardLastMonthsIncomeExpense] =
    await Promise.all([
      balanceLastMonthsData,
      dashboardLastMonthsIncomeExpenseData,
    ])

  return (
    <div className="w-full space-y-8">
      <HeaderPage
        buttonText="Voltar para  a Home"
        description="Sua saúde financeira, tendências de renda e hábitos de gasto em resumo. "
        href="/"
        title="Relatórios Financeiros"
        icon={false}
      />

      <ChartArea chartData={balanceLastMonths} />

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <ChartBar chartData={dashboardLastMonthsIncomeExpense} />
        <div className="flex-1" />
      </div>
    </div>
  )
}
