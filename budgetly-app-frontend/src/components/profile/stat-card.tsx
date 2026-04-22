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
  if (isLoading) {
    return (
      <div className="border-border/60 animate-pulse rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <div className="bg-accent h-3 w-24 rounded" />
          <div className="bg-accent size-8 rounded-lg" />
        </div>
        <div className="bg-accent mt-4 h-9 w-16 rounded" />
      </div>
    )
  }

  return (
    <div className="border-border/60 card-hover rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          {label}
        </p>
        <div
          className={`flex size-8 items-center justify-center rounded-lg ${variantStyles[variant]}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        {value}
      </p>
    </div>
  )
}
