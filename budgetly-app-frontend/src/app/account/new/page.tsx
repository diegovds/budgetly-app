import { getAuthState } from '@/actions/get-auth-state'
import { NewAccount } from '@/components/new-account'
import { getAccountTypes } from '@/http/api'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Nova conta',
}

export default async function NewAccountPage() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  const accountTypes = await getAccountTypes()

  return (
    <div className="flex w-full items-center justify-center">
      <NewAccount accountTypes={accountTypes} />
    </div>
  )
}
