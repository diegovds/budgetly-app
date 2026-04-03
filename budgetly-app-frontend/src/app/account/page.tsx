import { getAuthState } from '@/actions/get-auth-state'
import { AccountGrid } from '@/components/account/account-grid'
import { HeaderPage } from '@/components/header-page'
import { getAccountTypes } from '@/http/api'
import { StoreAccountTypes } from '@/providers/store-account-type'
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

  const accountTypes = await getAccountTypes()

  return (
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
  )
}
