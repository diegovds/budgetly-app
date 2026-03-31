import { getAuthState } from '@/actions/get-auth-state'
import { ChangePasswordForm } from '@/components/profile/change-password-form'
import { UserStats } from '@/components/profile/user-stats'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Meu Perfil',
}

export default async function ProfilePage() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  return (
    <div className="w-full space-y-8">
      <header className="flex flex-col justify-between gap-4 md:items-center lg:flex-row">
        <div>
          <h1 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-left">
            Meu Perfil
          </h1>
          <p className="text-muted-foreground text-center text-sm font-medium text-balance md:text-base lg:text-left">
            Gerencie suas informações de acesso e acompanhe suas estatísticas.
          </p>
        </div>
        <Link href="/">
          <Button className="w-full text-xs md:w-fit md:text-sm">
            Voltar para a Home
          </Button>
        </Link>
      </header>

      <Card className="rounded">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            Estatísticas Gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserStats />
        </CardContent>
      </Card>

      <div className="max-w-md">
        <ChangePasswordForm />
      </div>
    </div>
  )
}
