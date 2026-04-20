import { GetTransactionsSummary200TransactionsItem } from '@/http/api'
import { formatCurrency, formatDate } from '@/utils/format'

type TransactionProps = {
  transaction: GetTransactionsSummary200TransactionsItem
}

export function Transaction({ transaction }: TransactionProps) {
  return (
    <div className="border-border/60 card-hover flex items-center justify-between rounded-lg border px-4 py-3">
      <div className="flex-1 space-y-0.5">
        <h3 className="text-sm font-medium">{transaction.name}</h3>
        <p className="text-muted-foreground text-xs">
          {formatDate(new Date(transaction.date))}
        </p>
      </div>
      <p
        className={`text-sm font-semibold ${transaction.amount < 0 ? 'text-destructive' : 'text-emerald-400'}`}
      >
        {formatCurrency(transaction.amount)}
      </p>
    </div>
  )
}
