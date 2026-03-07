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
  const getDashboardGetTopExpenseCategoriesData =
    getDashboardGettopexpensecategories()
  const expenseCategoryData = getDashboardGetlistcategories({
    type: 'EXPENSE',
    page: 1,
    limit: 5,
  })
  const incomecategoryData = getDashboardGetlistcategories({
    type: 'INCOME',
    page: 1,
    limit: 5,
  })

  const [
    balanceLastMonths,
    dashboardLastMonthsIncomeExpense,
    topExpenseCategories,
    expenseCategory,
    incomeCategory,
  ] = await Promise.all([
    balanceLastMonthsData,
    dashboardLastMonthsIncomeExpenseData,
    getDashboardGetTopExpenseCategoriesData,
    expenseCategoryData,
    incomecategoryData,
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

      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <ChartBar chartData={dashboardLastMonthsIncomeExpense} />
        <ChartPieDonutText chartData={topExpenseCategories} />
      </div>

      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <Card className="flex-1 p-4">
          <CardTitle className="">
            Desempenho das {incomeCategory.label}
          </CardTitle>
          <CategoryGrid
            categories={incomeCategory.categories}
            meta={incomeCategory.meta}
            label={incomeCategory.label}
            type={incomeCategory.type}
          />
        </Card>

        <Card className="flex-1 p-4">
          <CardTitle className="">
            Desempenho das {expenseCategory.label}
          </CardTitle>
          <CategoryGrid
            categories={expenseCategory.categories}
            meta={expenseCategory.meta}
            label={expenseCategory.label}
            type={expenseCategory.type}
          />
        </Card>
      </div>
    </div>
  )
}
