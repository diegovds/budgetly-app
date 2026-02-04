import { GetTransactionsSummary200TransactionsItem } from '@/http/api'
import { formatCurrency } from '@/utils/format'

type TransactionProps = {
  transaction: GetTransactionsSummary200TransactionsItem
}

export function Transaction({ transaction }: TransactionProps) {
  return (
    <div className="ring-muted-foreground flex items-center justify-between rounded p-4 ring">
      <div className="space-y-2">
        <h3 className="text-xl font-medium">{transaction.name}</h3>
        <p className="text-muted-foreground text-sm">{transaction.date}</p>
      </div>
      <p
        className={`font-semibold ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}
      >
        {formatCurrency(transaction.amount)}
      </p>
    </div>
  )
}
