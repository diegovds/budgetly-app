type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: number
  isLoading: boolean
}

export function StatCard({ icon, isLoading, label, value }: StatCardProps) {
  return (
    <div
      className={`bg-accent space-y-2 rounded p-4 ${isLoading ? 'animate-pulse text-transparent' : ''}`}
    >
      <div
        className={`text-muted-foreground flex items-center justify-between ${isLoading ? 'invisible' : ''}`}
      >
        <p className="text-sm font-semibold md:text-base">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-semibold md:text-3xl">{value}</p>
    </div>
  )
}
