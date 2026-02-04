import {
  GetCategory200CategoriesItem,
  GetTransactionsSummary200TransactionsItem,
} from '@/http/api'
import Link from 'next/link'
import { Category } from './category'
import { Transaction } from './transaction'

type MyTransactionsProps = {
  categories: GetCategory200CategoriesItem[]
  transactions: GetTransactionsSummary200TransactionsItem[]
}

export function MyTransactions({
  categories,
  transactions,
}: MyTransactionsProps) {
  return (
    <div className="bg-accent flex-2 space-y-8 rounded p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Grupos de Transações</h2>
          <Link href="/">Ver Tudo</Link>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {categories.map((category) => (
            <Category key={category.id} category={category} />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Transações Recentes</h2>
        <div className="grid grid-cols-1 gap-8">
          {transactions.map((transaction) => (
            <Transaction key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  )
}
