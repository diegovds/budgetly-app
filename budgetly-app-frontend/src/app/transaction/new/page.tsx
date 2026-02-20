import { getAuthState } from '@/actions/get-auth-state'
import { NewTransaction } from '@/components/transaction/new-transaction'
import { getAccount, getCategory } from '@/http/api'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Nova transação',
}

export default async function NewTransactionPage() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  const { accounts } = await getAccount({ limit: 50 })
  const { categories } = await getCategory({ limit: 50 })

  return (
    <div className="flex w-full items-center justify-center">
      <NewTransaction accounts={accounts} categories={categories} />
    </div>
  )
}
