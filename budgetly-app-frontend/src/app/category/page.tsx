import { getAuthState } from '@/actions/get-auth-state'
import { HeaderPage } from '@/components/header-page'
import { getCategory } from '@/http/api'
import { TrendingDown, TrendingUp } from 'lucide-react'
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

  const { categories, meta } = await getCategory({ limit: 50, page: 1 })

  return (
    <div className="w-full space-y-8">
      <HeaderPage
        buttonText="Adicionar Categoria"
        description="Gerencie suas categorias de receitas e despesas para organizar melhor suas finanças."
        href="/category/new"
        title="Gerenciar Categorias"
      />
      <div className="flex gap-8">
        <div className="bg-accent flex-1 space-y-2 rounded p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-200 p-1">
              <TrendingUp className="text-green-500" />
            </div>
            <h3 className="font-semibold">Categoria de Receita</h3>
          </div>
        </div>
        <div className="bg-accent flex-1 space-y-2 rounded p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-200 p-1">
              <TrendingDown className="text-red-500" />
            </div>
            <h3 className="font-semibold">Categoria de Despesa</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
