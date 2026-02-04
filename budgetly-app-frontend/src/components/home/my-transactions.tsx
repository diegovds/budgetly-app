import { GetCategory200CategoriesItem } from '@/http/api'
import Link from 'next/link'
import { Transaction } from './transaction'

type MyTransactionsProps = {
  categories: GetCategory200CategoriesItem[]
}

export function MyTransactions({ categories }: MyTransactionsProps) {
  return (
    <div className="bg-accent flex-2 space-y-4 rounded p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Grupos de Transações</h2>
          <Link href="/">Ver Tudo</Link>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {categories.map((category) => (
            <Transaction key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  )
}
