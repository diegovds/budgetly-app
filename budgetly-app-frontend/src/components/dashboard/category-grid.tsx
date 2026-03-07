import {
  GetDashboardGetlistcategories200CategoriesItem,
  GetDashboardGetlistcategories200Meta,
  GetDashboardGetlistcategories200Type,
} from '@/http/api'
import { formatCurrency } from '@/utils/format'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

type CategoryGridProps = {
  categories: GetDashboardGetlistcategories200CategoriesItem[]
  meta: GetDashboardGetlistcategories200Meta
  type: GetDashboardGetlistcategories200Type
}

export function CategoryGrid({ categories, meta, type }: CategoryGridProps) {
  return (
    <>
      <Card className="divide-accent gap-0 divide-y overflow-x-auto p-0">
        <div className="grid grid-cols-[2fr_1.5fr_1fr] p-4 text-sm font-semibold md:text-base">
          <p>Categoria</p>
          <p>Valor</p>
          <p>Percentual</p>
        </div>
        <ul className="divide-accent divide-y text-sm md:text-base">
          {categories.map((category) => (
            <li
              key={category.id}
              className="grid grid-cols-[2fr_1.5fr_1fr] items-center p-4"
            >
              <h3 className="truncate font-semibold">{category.name}</h3>
              <p
                className={`font-semibold ${
                  type === 'INCOME' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {formatCurrency(category.total)}
              </p>
              <p className="font-semibold">{category.percentage.toFixed(2)}%</p>
            </li>
          ))}
        </ul>
      </Card>
      <div className="flex gap-4 self-end">
        <Button variant="outline" className="text-xs md:text-sm">
          <ChevronLeft />
        </Button>
        <Button variant="outline" className="text-xs md:text-sm">
          <ChevronRight />
        </Button>
      </div>
    </>
  )
}
