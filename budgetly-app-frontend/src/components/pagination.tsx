import { SearchParams } from '@/app/transaction/page'
import { GetTransactions200Meta } from '@/http/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

type PaginationProps = {
  meta: GetTransactions200Meta
  params?: SearchParams
  name: string
}

export function Pagination({ meta, name, params }: PaginationProps) {
  const start = (meta.page - 1) * meta.limit + 1
  const end = Math.min(meta.page * meta.limit, meta.total)

  const totalPages = meta.totalPages
  const hasPrev = meta.page > 1
  const hasNext = meta.page < totalPages

  /**
   * Monta a query string preservando filtros
   */
  function buildQuery(params?: SearchParams, page?: number) {
    const query = new URLSearchParams()

    if (params?.startDate) query.set('startDate', params?.startDate)
    if (params?.endDate) query.set('endDate', params?.endDate)
    if (params?.accountId) query.set('accountId', params?.accountId)
    if (params?.categoryId) query.set('categoryId', params?.categoryId)
    if (params?.search) query.set('search', params?.search)

    query.set('page', String(page))

    return `?${query.toString()}`
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-4 pb-4 lg:flex-row">
      <p className="text-xs md:text-sm">
        Mostrando {start} a {end} de {meta.total} {name}
      </p>

      <nav className="flex items-center gap-2">
        {/* Anterior */}
        {hasPrev ? (
          <Link href={buildQuery(params, meta.page - 1)}>
            <Button variant="outline" className="text-xs md:text-sm">
              <ChevronLeft />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled className="text-xs md:text-sm">
            <ChevronLeft />
          </Button>
        )}

        {/* Próxima */}
        {hasNext ? (
          <Link href={buildQuery(params, meta.page + 1)}>
            <Button variant="outline" className="text-xs md:text-sm">
              <ChevronRight />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled className="text-xs md:text-sm">
            <ChevronRight />
          </Button>
        )}
      </nav>
    </div>
  )
}
