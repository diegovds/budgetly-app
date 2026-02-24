import { GetCategory200 } from '@/http/api'

type CategoryListProps = {
  categories: GetCategory200
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {categories.categories.map((category) => (
        <div key={category.id}>
          <div>
            <h4 className="bg-background rounded p-4 text-center text-sm font-semibold">
              {category.name}
            </h4>
          </div>
        </div>
      ))}
    </div>
  )
}
