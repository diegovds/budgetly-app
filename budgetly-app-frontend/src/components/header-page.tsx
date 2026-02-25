import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

type HeaderPageProps = {
  title: string
  description: string
  href: string
  buttonText: string
  icon?: boolean
}

export function HeaderPage({
  buttonText,
  description,
  href,
  icon,
  title,
}: HeaderPageProps) {
  return (
    <header className="lg-gap-0 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div>
        <h1 className="mb-4 text-center text-3xl font-bold lg:text-left">
          {title}
        </h1>
        <p className="text-muted-foreground text-center font-medium text-balance lg:text-left">
          {description}
        </p>
      </div>
      <Link href={href}>
        <Button className="w-full lg:w-fit">
          {icon !== false && <CirclePlus />} {buttonText}
        </Button>
      </Link>
    </header>
  )
}
