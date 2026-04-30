type Props = {
  name: string
}

export function UserProfileCard({ name }: Props) {
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="bg-card flex items-center gap-4 rounded-xl border p-5">
      <div className="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-full text-xl font-semibold">
        {initial}
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-muted-foreground text-sm">Membro Budgetly</p>
      </div>
    </div>
  )
}
