import { getAuthState } from '@/actions/get-auth-state'
import { ChangePasswordForm } from '@/components/profile/change-password-form'
import { UserStats } from '@/components/profile/user-stats'
import { UserProfileCard } from '@/components/profile/user-profile-card'
import { HeaderPage } from '@/components/header-page'
import { getUser } from '@/http/api'
import { BarChart3 } from 'lucide-react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Meu Perfil',
}

export default async function ProfilePage() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  const { name } = await getUser()

  return (
    <div className="w-full space-y-8">
      <HeaderPage
        buttonText="Voltar para a Home"
        description="Gerencie suas informações de acesso e acompanhe suas estatísticas."
        href="/"
        title="Meu Perfil"
        icon={false}
      />

      <UserProfileCard name={name} />

      <div className="bg-card space-y-4 rounded-xl border p-5">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 flex size-8 items-center justify-center rounded-lg">
            <BarChart3 className="text-primary size-4" />
          </div>
          <h3 className="font-semibold">Estatísticas Gerais</h3>
        </div>
        <UserStats />
      </div>

      <div className="max-w-md">
        <ChangePasswordForm />
      </div>
    </div>
  )
}
