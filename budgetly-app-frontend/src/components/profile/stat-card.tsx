type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: number
  isLoading: boolean
}

export function StatCard({ icon, isLoading, label, value }: StatCardProps) {
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
        <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
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
