import { getAuthState } from '@/actions/get-auth-state'
import { CategoryList } from '@/components/category/category-list'
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

  const expenseData = getCategory({ limit: 8, page: 1, type: 'EXPENSE' })
  const incomeData = getCategory({ limit: 8, page: 1, type: 'INCOME' })

  const [expenseCategories, incomeCategories] = await Promise.all([
    expenseData,
    incomeData,
  ])

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
            <h3 className="text-xl font-semibold">Categoria de Receita</h3>
            <CategoryList categories={incomeCategories} />
          </div>
        </div>
        <div className="bg-accent flex-1 space-y-2 rounded p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-200 p-1">
              <TrendingDown className="text-red-500" />
            </div>
            <h3 className="text-xl font-semibold">Categoria de Despesa</h3>
            <CategoryList categories={expenseCategories} />
          </div>
        </div>
      </div>
    </div>
  )
}
