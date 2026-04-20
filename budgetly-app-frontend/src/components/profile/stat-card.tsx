type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: number
  isLoading: boolean
  variant?: 'default' | 'income' | 'expense'
}

const variantStyles = {
  default: 'bg-primary/10 text-primary',
  income: 'bg-emerald-500/10 text-emerald-400',
  expense: 'bg-destructive/10 text-destructive',
}

export function StatCard({
  icon,
  isLoading,
  label,
  value,
  variant = 'default',
}: StatCardProps) {
  return (
    <div
      className={`border-border/60 card-hover rounded-xl border p-5 ${isLoading ? 'animate-pulse' : ''}`}
    >
      <div
        className={`flex items-center justify-between ${isLoading ? 'invisible' : ''}`}
      >
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          {label}
        </p>
        <div
          className={`flex size-8 items-center justify-center rounded-lg ${variantStyles[variant]}`}
        >
          {icon}
        </div>
      </div>
      <p
        className={`mt-3 text-3xl font-semibold tracking-tight md:text-4xl ${isLoading ? 'invisible' : ''}`}
      >
        {value}
      </p>
    </div>
  )
}
