import { getAuthState } from '@/actions/get-auth-state'
import { ChartArea } from '@/components/dashboard/area-chart'
import { CategoryGrid } from '@/components/dashboard/category-grid'
import { ChartBar } from '@/components/dashboard/chart-bar'
import { ChartPieDonutText } from '@/components/dashboard/chart-pie-donut-text'
import { HeaderPage } from '@/components/header-page'
import { Card, CardTitle } from '@/components/ui/card'
import {
  getDashboardBalancelastmonths,
  getDashboardGetlistcategories,
  getDashboardGettopexpensecategories,
  getDashboardLastmonthsincomeexpense,
} from '@/http/api'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
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

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['dashboard-categories', 'EXPENSE', 1],
    queryFn: () =>
      getDashboardGetlistcategories({
        type: 'EXPENSE',
        limit: 5,
        page: 1,
      }),
  })

  await queryClient.prefetchQuery({
    queryKey: ['dashboard-categories', 'INCOME', 1],
    queryFn: () =>
      getDashboardGetlistcategories({
        type: 'INCOME',
        limit: 5,
        page: 1,
      }),
  })

  const balanceLastMonthsData = getDashboardBalancelastmonths()
  const dashboardLastMonthsIncomeExpenseData =
    getDashboardLastmonthsincomeexpense()
  const getDashboardGetTopExpenseCategoriesData =
    getDashboardGettopexpensecategories()

  const [
    balanceLastMonths,
    dashboardLastMonthsIncomeExpense,
    topExpenseCategories,
  ] = await Promise.all([
    balanceLastMonthsData,
    dashboardLastMonthsIncomeExpenseData,
    getDashboardGetTopExpenseCategoriesData,
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full space-y-8">
        <HeaderPage
          buttonText="Voltar para  a Home"
          description="Sua saúde financeira, tendências de renda e hábitos de gasto em resumo. "
          href="/"
          title="Relatórios Financeiros"
          icon={false}
        />

        <ChartArea chartData={balanceLastMonths} />

        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <ChartBar chartData={dashboardLastMonthsIncomeExpense} />
          <ChartPieDonutText chartData={topExpenseCategories} />
        </div>

        <div className="grid w-full items-start gap-8 lg:grid-cols-2">
          <Card className="overflow-x-auto p-4">
            <CardTitle className="">Desempenho das Receitas</CardTitle>
            <CategoryGrid type="INCOME" />
          </Card>

          <Card className="overflow-x-auto p-4">
            <CardTitle className="">Desempenho das Despesas</CardTitle>
            <CategoryGrid type="EXPENSE" />
          </Card>
        </div>
      </div>
    </HydrationBoundary>
  )
}
