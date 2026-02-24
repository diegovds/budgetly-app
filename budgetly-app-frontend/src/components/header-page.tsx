import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

type HeaderPageProps = {
  title: string
  description: string
  href: string
  buttonText: string
}

export function HeaderPage({
  buttonText,
  description,
  href,
  title,
}: HeaderPageProps) {
  return (
    <header className="lg-gap-0 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div>
        <h1 className="mb-4 text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground font-medium">{description}</p>
      </div>
      <Link href={href}>
        <Button className="w-fit">
          <CirclePlus /> {buttonText}
        </Button>
      </Link>
    </header>
  )
}
