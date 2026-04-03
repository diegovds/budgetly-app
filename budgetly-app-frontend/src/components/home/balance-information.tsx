import { formatCurrency } from '@/utils/format'

type BalanceInformationProps = {
  balance?: number
  icon: React.ReactNode
  text: string
  isLoading: boolean
}

export function BalanceInformation({
  balance,
  icon,
  text,
  isLoading,
}: BalanceInformationProps) {
  return (
    <div
      className={`bg-accent space-y-2 rounded p-4 ${isLoading ? 'animate-pulse' : ''}`}
    >
      <div
        className={`text-muted-foreground flex items-center justify-between ${isLoading ? 'invisible' : ''}`}
      >
        <p className="text-sm font-semibold md:text-base">{text}</p>
        {icon}
      </div>
      <p
        className={`text-2xl font-semibold md:text-3xl ${isLoading ? 'invisible' : ''}`}
      >
        {!isLoading && balance !== undefined ? formatCurrency(balance) : '_'}
      </p>
    </div>
  )
}
