import { formatCurrency } from '@/utils/format'

type AccountProps = {
  account: {
    id: string
    name: string
    balance: number
  }
}

export function Account({ account }: AccountProps) {
  return (
    <div className="border-border/60 card-hover flex items-center justify-between rounded-lg border px-4 py-3">
      <h3 className="text-sm font-medium">{account.name}</h3>
      <p
        className={`text-sm font-semibold ${account.balance >= 0 ? 'text-emerald-400' : 'text-destructive'}`}
      >
        {formatCurrency(account.balance)}
      </p>
    </div>
  )
}
