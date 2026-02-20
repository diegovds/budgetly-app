import { getAuthState } from '@/actions/get-auth-state'
import { Button } from '@/components/ui/button'
import { getAccount } from '@/http/api'
import { CirclePlus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Minhas contas',
}

export default async function AccountPage() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  const { accounts, meta } = await getAccount({ limit: 4 })

  return (
    <div className="w-full space-y-8">
      <header className="lg-gap-0 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="mb-4 text-3xl font-bold">Gerenciar Contas</h1>
          <p className="text-muted-foreground font-medium">
            Gerencie suas contas bancárias, cartões de crédito e outras fontes
            de renda.
          </p>
        </div>
        <Link href="/account/new">
          <Button className="w-fit">
            <CirclePlus /> Adicionar Conta
          </Button>
        </Link>
      </header>
    </div>
  )
}
