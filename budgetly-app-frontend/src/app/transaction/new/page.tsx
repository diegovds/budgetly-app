import { getAuthState } from '@/actions/get-auth-state'
import { NewTransaction } from '@/components/new-transaction'
import { getAccount, getCategory } from '@/http/api'
import { redirect } from 'next/navigation'

export default async function NewTransactionPage() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  const accounts = await getAccount()
  const { categories } = await getCategory()

  return (
    <div className="flex w-full items-center justify-center">
      <NewTransaction accounts={accounts} categories={categories} />
    </div>
  )
}
