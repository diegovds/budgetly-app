import { formatCurrency } from '@/utils/format'

type BalanceInformationProps = {
  balance: number
  icon: React.ReactNode
  text: string
}

export function BalanceInformation({
  balance,
  icon,
  text,
}: BalanceInformationProps) {
  return (
    <div className="bg-accent space-y-2 rounded p-4">
      <div className="text-muted-foreground flex items-center justify-between">
        <p className="text-sm font-semibold md:text-base">{text}</p>
        {icon}
      </div>
      <p className="text-2xl font-semibold md:text-3xl">
        {formatCurrency(balance)}
      </p>
    </div>
  )
}
