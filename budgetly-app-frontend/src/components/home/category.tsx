import { GetCategory200CategoriesItem } from '@/http/api'
import { formatCurrency } from '@/utils/format'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

type CategoryProps = {
  category: GetCategory200CategoriesItem
}

export function Category({ category }: CategoryProps) {
  return (
    <div className="border-border/60 card-hover flex flex-col justify-between gap-3 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{category.name}</h3>
        <Link href={`/transaction?categoryId=${category.id}`}>
          <ChevronRight className="text-muted-foreground hover:text-foreground size-4 transition-colors" />
        </Link>
      </div>
      <div className="space-y-0.5">
        <p className="text-muted-foreground text-xs">Últimos 30 dias</p>
        <span
          className={`text-base font-semibold ${category.total < 0 ? 'text-destructive' : 'text-emerald-400'}`}
        >
          {formatCurrency(category.total)}
        </span>
      </div>
    </div>
  )
}
