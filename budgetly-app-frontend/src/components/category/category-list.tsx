'use client'

import {
  getCategory,
  GetCategory200,
  GetCategory200CategoriesItemType,
} from '@/http/api'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Button } from '../ui/button'

type CategoryListProps = {
  categories: GetCategory200
  type: GetCategory200CategoriesItemType
}

export function CategoryList({ categories, type }: CategoryListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<GetCategory200>({
      queryKey: ['categories', type],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getCategory({
          type,
          limit: 9,
          page: pageParam as number,
        }),
      getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage.meta

        if (page < totalPages) {
          return page + 1
        }

        return undefined
      },
      initialData: {
        pages: [categories],
        pageParams: [1],
      },
    })

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-8 lg:grid-cols-3">
        {data.pages.map((group) =>
          group.categories.map((category) => (
            <div key={category.id}>
              <h4 className="bg-background rounded p-4 text-center text-sm font-semibold">
                {category.name}
              </h4>
            </div>
          )),
        )}
      </div>

      {hasNextPage && (
        <Button
          className="w-fit self-center"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
        </Button>
      )}
    </div>
  )
}
