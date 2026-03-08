import { getAuthState } from '@/actions/get-auth-state'
import { AccountGrid } from '@/components/account/account-grid'
import { HeaderPage } from '@/components/header-page'
import { getAccount, getAccountTypes } from '@/http/api'
import { StoreAccountTypes } from '@/providers/store-account-type'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Minhas contas',
}

export default async function AccountPage() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['accounts', 1],
    queryFn: () => getAccount({ limit: 4, page: 1 }),
  })

  const accountTypesData = getAccountTypes()

  const [accountTypes] = await Promise.all([accountTypesData])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full space-y-8">
        <StoreAccountTypes accountTypes={accountTypes} />

        <HeaderPage
          buttonText="Adicionar Conta"
          description="Gerencie suas contas bancárias, cartões de crédito e outras fontes de renda."
          href="/account/new"
          title="Gerenciar Contas"
        />

        <AccountGrid />
      </div>
    </HydrationBoundary>
  )
}
