import { getAuthState } from '@/actions/get-auth-state'
import { HeaderPage } from '@/components/header-page'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Minhas categorias',
}

export default async function CategoryPage() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  return (
    <div className="w-full space-y-8">
      <HeaderPage
        buttonText="Adicionar Categoria"
        description="Gerencie suas categorias de receitas e despesas para organizar melhor suas finanças."
        href="/category/new"
        title="Gerenciar Categorias"
      />
    </div>
  )
}
