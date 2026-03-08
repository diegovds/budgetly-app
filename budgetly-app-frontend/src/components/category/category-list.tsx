'use client'

import {
  getCategory,
  GetCategory200,
  GetCategory200CategoriesItemType,
} from '@/http/api'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../ui/button'

type CategoryListProps = {
  type: GetCategory200CategoriesItemType
  label: string
}

export function CategoryList({ label, type }: CategoryListProps) {
  const [page, setPage] = useState(1)

  const { data } = useQuery<GetCategory200>({
    queryKey: ['categories', type, page],
    queryFn: () =>
      getCategory({
        type,
        limit: 9,
        page,
      }),
    placeholderData: (prev) => prev,
  })

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
          <div key={category.id}>
            <h4 className="bg-background flex items-center justify-between rounded p-4 text-xs font-semibold">
              {category.name}
              <Link href={`/transaction?categoryId=${category.id}`}>
                <ChevronRight size={15} />
              </Link>
            </h4>
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
          </div>
        )}
      </div>
    </div>
  )
}
