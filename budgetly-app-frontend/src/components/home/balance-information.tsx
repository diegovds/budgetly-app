import { formatCurrency } from '@/utils/format'

type BalanceInformationProps = {
  balance?: number
  icon: React.ReactNode
  text: string
  isLoading: boolean
  variant?: 'neutral' | 'income' | 'expense'
}

const variantStyles = {
  neutral: {
    wrapper: 'border-border/60 bg-card',
    icon: 'bg-primary/10 text-primary',
    value: 'text-foreground',
  },
  income: {
    wrapper: 'border-border/60 bg-card',
    icon: 'bg-emerald-500/10 text-emerald-400',
    value: 'text-emerald-400',
  },
  expense: {
    wrapper: 'border-border/60 bg-card',
    icon: 'bg-destructive/10 text-destructive',
    value: 'text-destructive',
  },
}

export function BalanceInformation({
  balance,
  icon,
  text,
  isLoading,
  variant = 'neutral',
}: BalanceInformationProps) {
  const styles = variantStyles[variant]

  return (
    <div
      className={`card-hover rounded-xl border p-5 ${styles.wrapper} ${isLoading ? 'animate-pulse' : ''}`}
    >
      <div className={`flex items-center justify-between ${isLoading ? 'invisible' : ''}`}>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          {text}
        </p>
        <div className={`flex size-8 items-center justify-center rounded-lg ${styles.icon}`}>
          {icon}
        </div>
      </div>
      <p
        className={`mt-3 text-3xl font-semibold tracking-tight md:text-4xl ${styles.value} ${isLoading ? 'invisible' : ''}`}
      >
        {!isLoading && balance !== undefined ? formatCurrency(balance) : '_'}
      </p>
    </div>
  )
}
