import { GetCategory200CategoriesItem } from '@/http/api'
import { formatCurrency } from '@/utils/format'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

type CategoryProps = {
  category: GetCategory200CategoriesItem
}

export function Category({ category }: CategoryProps) {
  return (
    <div className="ring-muted-foreground flex flex-col justify-between space-y-4 rounded p-4 ring">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium">{category.name}</h3>
        <Link href="/">
          <ChevronRight />
        </Link>
      </div>
      <div className="space-y-0.5">
        <p className="text-muted-foreground text-sm">Últimos 30 dias</p>
        <span
          className={`text-xl font-medium ${category.total < 0 ? 'text-red-500' : 'text-green-500'}`}
        >
          {formatCurrency(category.total)}
        </span>
      </div>
    </div>
  )
}
