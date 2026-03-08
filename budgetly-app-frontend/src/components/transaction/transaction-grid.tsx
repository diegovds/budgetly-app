import {
    GetTransactions200
} from '@/http/api'
import { formatCurrency, formatDate } from '@/utils/format'

type TransactionGridProps = {
  transactions: GetTransactions200
}

export function TransactionGrid({ transactions }: TransactionGridProps) {
  return (
    <div className="bg-card divide-accent divide-y overflow-x-auto rounded-md border">
      {/* Header */}
      <div className="grid min-w-225 grid-cols-[120px_2fr_1.5fr_1.5fr_1fr] p-4 text-sm font-semibold md:text-base">
        <p>Data</p>
        <p>Descrição</p>
        <p>Categoria</p>
        <p>Conta</p>
        <p>Valor</p>
      </div>

      {/* Body */}
      <ul className="divide-accent min-w-225 divide-y text-sm md:text-base">
        {transactions.transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="grid grid-cols-[120px_2fr_1.5fr_1.5fr_1fr] items-center p-4"
          >
            <p className="text-muted-foreground">
              {formatDate(new Date(transaction.date))}
            </p>
            <p className="truncate font-semibold">{transaction.description}</p>
            <p className="w-fit rounded-xl border p-2 text-xs md:text-sm">
              {transaction.categoryName}
            </p>
            <p className="text-muted-foreground">{transaction.accountName}</p>
            <p
              className={`font-semibold ${
                transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {formatCurrency(transaction.amount)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
