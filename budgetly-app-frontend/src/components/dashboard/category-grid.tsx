import {
    GetDashboardGetlistcategories200CategoriesItem,
    GetDashboardGetlistcategories200Meta,
} from '@/http/api'
import { formatCurrency } from '@/utils/format'
import { Card } from '../ui/card'

type CategoryGridProps = {
  categories: GetDashboardGetlistcategories200CategoriesItem[]
  meta: GetDashboardGetlistcategories200Meta
}

export function CategoryGrid({ categories, meta }: CategoryGridProps) {
  return (
    <Card className="divide-accent flex-1 gap-0 divide-y overflow-x-auto p-0">
      <div className="grid grid-cols-3 p-4 text-sm font-semibold md:text-base">
        <p>Categoria</p>
        <p>Valor</p>
        <p>Percentual</p>
      </div>
      <ul className="divide-accent divide-y text-sm md:text-base">
        {categories.map((category) => (
          <li key={category.id} className="grid grid-cols-3 items-center p-4">
            <h3 className="truncate font-semibold">{category.name}</h3>
            <p
              className={`font-semibold ${
                category.total >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {formatCurrency(category.total)}
            </p>
            <p className="font-semibold">{category.percentage.toFixed(2)}%</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
