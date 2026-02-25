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
    <header className="lg-gap-0 flex flex-col justify-between gap-4 md:items-center lg:flex-row">
      <div>
        <h1 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-left">
          {title}
        </h1>
        <p className="text-muted-foreground text-center text-sm font-medium text-balance md:text-base lg:text-left">
          {description}
        </p>
      </div>
      <Link href={href}>
        <Button className="w-full text-xs md:w-fit md:text-sm">
          {icon !== false && <CirclePlus />} {buttonText}
        </Button>
      </Link>
    </header>
  )
}
