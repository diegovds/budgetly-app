'use client'

import {
  getCategory,
  GetCategory200,
  GetCategory200CategoriesItemType,
} from '@/http/api'
import { useModalStore } from '@/store/useModalStore.ts'
import { formatCurrency } from '@/utils/format'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ChevronRight, Ellipsis } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { TablePagination } from '../table-pagination'

type CategoryListProps = {
  type: GetCategory200CategoriesItemType
  label: string
}

export function CategoryList({ label, type }: CategoryListProps) {
  const { setElement, setWhoOpened, setIsOpen } = useModalStore()
  const [page, setPage] = useState(1)
  const { data, isPlaceholderData, isError, error } = useQuery<
    GetCategory200,
    Error
  >({
    queryKey: ['categories', type, page],
    queryFn: () =>
      getCategory({
        type,
        limit: 9,
        page,
        dateRange: 'all',
      }),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (isError) {
      toast.error('Erro ao buscar categorias.')
    }
  }, [isError, error])

  if (!data)
    return (
      <div className="flex flex-col gap-5">
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-accent flex animate-pulse flex-col gap-4 rounded-xl p-4 text-transparent"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold">_</h4>
                <Ellipsis size={15} className="cursor-pointer" />
              </div>

              <div className="flex items-center justify-between">
                <p className={`text-xs font-semibold`}>_</p>
                <Link href={`/transaction?categoryId=`}>
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <TablePagination
          page={1}
          totalPages={2}
          total={0}
          start={0}
          end={0}
          label={label}
          isLoading={true}
          className="pt-4 pb-5"
          onPrev={() => {}}
          onNext={() => {}}
        />
      </div>
    )

  const currentMeta = data.meta
  const start = (currentMeta.page - 1) * currentMeta.limit + 1
  const end = Math.min(
    currentMeta.page * currentMeta.limit,
    currentMeta.totalCategories,
  )

  return (
    <div className="flex flex-col">
      <div className="grid gap-4 lg:grid-cols-3">
        {data.categories.map((category) => (
          <div
            key={category.id}
            className="border-border/60 card-hover flex flex-col gap-4 rounded-xl border p-4"
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
                  category.type === 'INCOME' ? 'text-emerald-400' : 'text-destructive'
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

      <TablePagination
        page={currentMeta.page}
        totalPages={currentMeta.totalPages}
        total={currentMeta.totalCategories}
        start={start}
        end={end}
        label={label}
        isLoading={isPlaceholderData}
        className="pt-4 pb-5"
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  )
}
