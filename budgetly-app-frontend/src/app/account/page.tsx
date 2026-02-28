import { getAuthState } from '@/actions/get-auth-state'
import { HeaderPage } from '@/components/header-page'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { getAccount, getAccountTypes } from '@/http/api'
import { StoreAccountTypes } from '@/providers/store-account-type'
import { formatCurrency } from '@/utils/format'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Minhas contas',
}

type SearchParams = {
  page?: number
}

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function AccountPage({ searchParams }: Props) {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  const params = await searchParams

  const currentPage = params.page ?? 1

  const accountsData = getAccount({ limit: 4, page: currentPage })
  const accountTypesData = getAccountTypes()

  const [accounts, accountTypes] = await Promise.all([
    accountsData,
    accountTypesData,
  ])

  return (
    <div className="w-full space-y-8">
      <StoreAccountTypes accountTypes={accountTypes} />

      <HeaderPage
        buttonText="Adicionar Conta"
        description="Gerencie suas contas bancárias, cartões de crédito e outras fontes de renda."
        href="/account/new"
        title="Gerenciar Contas"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {accounts.accounts.map((account) => (
          <div key={account.id} className="bg-accent space-y-4 rounded p-4">
            <div className="space-y-0.5">
              <h2 className="text-lg font-semibold md:text-xl">
                {account.name}
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                {account.type}
              </p>
            </div>
            <div className="space-y-0.5">
              <h2 className="text-muted-foreground text-sm font-semibold md:text-base">
                Saldo atual
              </h2>
              <p
                className={`text-2xl font-semibold md:text-3xl ${
                  account.balance >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {formatCurrency(account.balance)}
              </p>
            </div>
            <div className="flex justify-end">
              <Link href={`/transaction?accountId=${account.id}`}>
                <Button variant="outline" className="text-xs md:text-sm">
                  Ver Transações
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Pagination meta={accounts.meta} name="contas" />
    </div>
  )
}
