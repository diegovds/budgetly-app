import { getAuthState } from '@/actions/get-auth-state'
import { CategoryList } from '@/components/category/category-list'
import { HeaderPage } from '@/components/header-page'
import { getCategory, getCategoryTypes } from '@/http/api'
import { StoreCategoryTypes } from '@/providers/store-category-type'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
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

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['categories', 'EXPENSE', 1],
    queryFn: () =>
      getCategory({
        type: 'EXPENSE',
        limit: 9,
        page: 1,
        dateRange: 'all',
      }),
  })

  await queryClient.prefetchQuery({
    queryKey: ['categories', 'INCOME', 1],
    queryFn: () =>
      getCategory({
        type: 'INCOME',
        limit: 9,
        page: 1,
        dateRange: 'all',
      }),
  })

  const categoryTypesData = getCategoryTypes()

  const [categoryTypes] = await Promise.all([categoryTypesData])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full space-y-8">
        <StoreCategoryTypes categoryTypes={categoryTypes} />

        <HeaderPage
          buttonText="Adicionar Categoria"
          description="Gerencie suas categorias de receitas e despesas para organizar melhor suas finanças."
          href="/category/new"
          title="Gerenciar Categorias"
        />
        <div className="flex flex-col items-start gap-8 md:flex-row">
          <div className="bg-accent w-full flex-1 space-y-4 rounded p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-200 p-1">
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <h3 className="font-semibold md:text-xl">Categoria de Receita</h3>
            </div>
            <CategoryList label="Receitas" type="INCOME" />
          </div>

          <div className="bg-accent w-full flex-1 space-y-4 rounded p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-red-200 p-1">
                <TrendingDown className="text-red-500" size={20} />
              </div>
              <h3 className="font-semibold md:text-xl">Categoria de Despesa</h3>
            </div>
            <CategoryList label="Despesas" type="EXPENSE" />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  )
}
