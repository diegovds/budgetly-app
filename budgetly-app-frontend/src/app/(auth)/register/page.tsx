import { Register } from '@/components/auth/register/register'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cadastro',
}

export default async function RegisterPage() {
  return (
    <div className="flex w-full">
      <Register />
    </div>
  )
}
