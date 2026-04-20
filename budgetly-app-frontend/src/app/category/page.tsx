import { getAuthState } from '@/actions/get-auth-state'
import { CategoryList } from '@/components/category/category-list'
import { HeaderPage } from '@/components/header-page'
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

  return (
    <div className="w-full space-y-8">
      <HeaderPage
        buttonText="Adicionar Categoria"
        description="Gerencie suas categorias de receitas e despesas para organizar melhor suas finanças."
        href="/category/new"
        title="Gerenciar Categorias"
      />
      <div className="flex flex-col items-start gap-8 md:flex-row">
        <div className="bg-card w-full flex-1 space-y-4 rounded-xl border p-5 pb-0">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp className="size-4 text-emerald-400" />
            </div>
            <h3 className="font-semibold">Categoria de Receita</h3>
          </div>
          <CategoryList label="Receitas" type="INCOME" />
        </div>

        <div className="bg-card w-full flex-1 space-y-4 rounded-xl border p-5 pb-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-destructive/10 flex size-8 items-center justify-center rounded-lg">
              <TrendingDown className="text-destructive size-4" />
            </div>
            <h3 className="font-semibold">Categoria de Despesa</h3>
          </div>
          <CategoryList label="Despesas" type="EXPENSE" />
        </div>
      </div>
    </div>
  )
}
