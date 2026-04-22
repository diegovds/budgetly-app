import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from './ui/button'

type TablePaginationProps = {
  page: number
  totalPages: number
  total: number
  start: number
  end: number
  label: string
  isLoading?: boolean
  className?: string
  onPrev: () => void
  onNext: () => void
}

export function TablePagination({
  className,
  end,
  isLoading,
  label,
  onNext,
  onPrev,
  page,
  start,
  total,
  totalPages,
}: TablePaginationProps) {
  return (
    <div
      className={`flex flex-col items-center justify-between gap-3 lg:flex-row ${className ?? ''}`}
    >
      {isLoading ? (
        <div className="bg-accent h-3 w-36 animate-pulse rounded" />
      ) : (
        <p className="text-muted-foreground text-xs">
          Mostrando {start}–{end} de {total} {label}
        </p>
      )}

      {totalPages > 1 &&
        (isLoading ? (
          <Button variant="outline" size="sm" disabled>
            <Loader2 className="size-4 animate-spin" />
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={onPrev}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-muted-foreground text-xs">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={onNext}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ))}
    </div>
  )
}
