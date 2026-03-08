import { getAuthState } from '@/actions/get-auth-state'
import { CategoryList } from '@/components/category/category-list'
import { HeaderPage } from '@/components/header-page'
import { getCategory, getCategoryTypes } from '@/http/api'
import { StoreCategoryTypes } from '@/providers/store-category-type'
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

  const expenseData = getCategory({ limit: 9, page: 1, type: 'EXPENSE' })
  const incomeData = getCategory({ limit: 9, page: 1, type: 'INCOME' })
  const categoryTypesData = getCategoryTypes()

  const [expenseCategories, incomeCategories, categoryTypes] =
    await Promise.all([expenseData, incomeData, categoryTypesData])

  return (
    <div className="w-full space-y-8">
      <StoreCategoryTypes categoryTypes={categoryTypes} />

      <HeaderPage
        buttonText="Adicionar Categoria"
        description="Gerencie suas categorias de receitas e despesas para organizar melhor suas finanças."
        href="/category/new"
        title="Gerenciar Categorias"
      />
      <div className="flex flex-col items-start gap-8 md:flex-row">
        {incomeCategories.categories.length !== 0 ? (
          <div className="bg-accent w-full flex-1 space-y-4 rounded p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-200 p-1">
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <h3 className="font-semibold md:text-xl">Categoria de Receita</h3>
            </div>
            <CategoryList
              categories={incomeCategories}
              label="Receitas"
              type="INCOME"
            />
          </div>
        ) : (
          <div className="flex-1 p-4" />
        )}
        {expenseCategories.categories.length !== 0 ? (
          <div className="bg-accent w-full flex-1 space-y-4 rounded p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-red-200 p-1">
                <TrendingDown className="text-red-500" size={20} />
              </div>
              <h3 className="font-semibold md:text-xl">Categoria de Despesa</h3>
            </div>
            <CategoryList
              categories={expenseCategories}
              label="Despesas"
              type="EXPENSE"
            />
          </div>
        ) : (
          <div className="flex-1 p-4" />
        )}
      </div>
    </div>
  )
}
