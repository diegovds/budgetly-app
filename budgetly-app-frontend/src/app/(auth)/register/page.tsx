import { getAuthState } from '@/actions/get-auth-state'
import { Register } from '@/components/auth/register/register'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
  const token = await getAuthState()

  if (token) {
    redirect('/')
  }

  return (
    <div className="flex w-full gap-6">
      <Register />
    </div>
  )
}
