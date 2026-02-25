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
    <div className="bg-background flex items-center justify-between rounded p-4">
      <h3 className="text-sm font-medium md:text-base">{account.name}</h3>
      <p
        className={`text-sm font-semibold md:text-base ${account.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}
      >
        {formatCurrency(account.balance)}
      </p>
    </div>
  )
}
