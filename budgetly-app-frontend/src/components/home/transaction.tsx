import { GetTransactionsSummary200TransactionsItem } from '@/http/api'
import { formatCurrency, formatDate } from '@/utils/format'

type TransactionProps = {
  transaction: GetTransactionsSummary200TransactionsItem
}

export function Transaction({ transaction }: TransactionProps) {
  return (
    <div className="bg-background flex items-center justify-between rounded p-4">
      <div className="flex-1 space-y-2">
        <h3 className="text-xl font-medium">{transaction.name}</h3>
        <p className="text-muted-foreground text-sm">
          {formatDate(new Date(transaction.date))}
        </p>
      </div>
      <p
        className={`flex-1 text-right font-semibold ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}
      >
        {formatCurrency(transaction.amount)}
      </p>
    </div>
  )
}
