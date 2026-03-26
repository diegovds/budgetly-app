'use client'

import {
  getCategory,
  GetCategory200,
  GetCategory200CategoriesItemType,
} from '@/http/api'
import { useModalStore } from '@/store/useModalStore.ts'
import { formatCurrency } from '@/utils/format'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Ellipsis, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'

type CategoryListProps = {
  type: GetCategory200CategoriesItemType
  label: string
}

export function CategoryList({ label, type }: CategoryListProps) {
  const { setElement, setWhoOpened, setIsOpen } = useModalStore()
  const [page, setPage] = useState(1)
  const hasFetched = useRef(false)
  const { data, isFetching, isError, error } = useQuery<GetCategory200, Error>({
    queryKey: ['categories', type, page],
    queryFn: () =>
      getCategory({
        type,
        limit: 9,
        page,
        dateRange: 'all',
      }),
    placeholderData: (prev) => prev,
  })

  useEffect(() => {
    if (!isFetching) hasFetched.current = true
  }, [isFetching])

  useEffect(() => {
    if (isError) {
      toast.error('Erro ao buscar categorias.')
    }
  }, [isError, error])

  if (!data) return null

  const currentMeta = data.meta
  const start = (currentMeta.page - 1) * currentMeta.limit + 1
  const end = Math.min(
    currentMeta.page * currentMeta.limit,
    currentMeta.totalCategories,
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-3">
        {data.categories.map((category) => (
          <div
            key={category.id}
            className="bg-background flex flex-col gap-4 rounded p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-semibold">{category.name}</h4>
              <Ellipsis
                size={15}
                className="cursor-pointer"
                onClick={() => {
                  setElement({ type: 'category', data: category })
                  setWhoOpened('category/manage')
                  setIsOpen(true)
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <p
                className={`text-xs font-semibold ${
                  category.total >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {formatCurrency(category.total)}
              </p>
              <Link href={`/transaction?categoryId=${category.id}`}>
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <p className="text-xs md:text-sm">
          Mostrando {start} a {end} de um total de {currentMeta.totalCategories}{' '}
          {label}
        </p>
        {currentMeta.totalPages > 1 && (
          <div className="flex items-center gap-2">
            {isFetching && hasFetched.current ? (
              <Button variant="outline" className="text-xs md:text-sm">
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="text-xs md:text-sm"
                  disabled={currentMeta.page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft />
                </Button>

                <Button
                  variant="outline"
                  className="text-xs md:text-sm"
                  disabled={currentMeta.page === currentMeta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
