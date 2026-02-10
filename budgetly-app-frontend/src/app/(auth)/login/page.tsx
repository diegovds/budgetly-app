import { Login } from '@/components/auth/login/login'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
}

export default async function LoginPage() {
  return (
    <div className="flex w-full gap-6">
      <Login />
    </div>
  )
}
