import { getAuthState } from '@/actions/get-auth-state'
import { ChartArea } from '@/components/dashboard/area-chart'
import { HeaderPage } from '@/components/header-page'
import { getDashboardBalancelastmonths } from '@/http/api'
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

  const balancelastmonths = await getDashboardBalancelastmonths()

  return (
    <div className="w-full space-y-8">
      <HeaderPage
        buttonText="Voltar para  a Home"
        description="Sua saúde financeira, tendências de renda e hábitos de gasto em resumo. "
        href="/"
        title="Relatórios Financeiros"
        icon={false}
      />

      <ChartArea chartData={balancelastmonths} />
    </div>
  )
}
