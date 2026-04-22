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

  if (isLoading) {
    return (
      <div className="border-border/60 bg-card animate-pulse rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <div className="bg-accent h-3 w-24 rounded" />
          <div className="bg-accent size-8 rounded-lg" />
        </div>
        <div className="bg-accent mt-4 h-9 w-28 rounded" />
      </div>
    )
  }

  return (
    <div className={`card-hover rounded-xl border p-5 ${styles.wrapper}`}>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          {text}
        </p>
        <div className={`flex size-8 items-center justify-center rounded-lg ${styles.icon}`}>
          {icon}
        </div>
      </div>
      <p className={`mt-3 text-3xl font-semibold tracking-tight md:text-4xl ${styles.value}`}>
        {balance !== undefined ? formatCurrency(balance) : '—'}
      </p>
    </div>
  )
}
