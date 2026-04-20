'use client'

import { useModalStore } from '@/store/useModalStore.ts'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { Modal } from './modal'
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
  const { setIsOpen, setWhoOpened } = useModalStore()

  return (
    <header className="flex flex-col justify-between gap-3 md:items-center lg:flex-row lg:gap-0">
      <div>
        <h1 className="mb-1.5 text-center text-3xl font-(family-name:--font-serif-display) md:text-4xl lg:text-left">
          {title}
        </h1>
        <p className="text-muted-foreground text-center text-sm text-balance lg:text-left">
          {description}
        </p>
      </div>

      {icon !== false ? (
        <Button
          className="w-full gap-2 md:w-fit"
          onClick={() => {
            setIsOpen(true)
            setWhoOpened(href)
          }}
        >
          <CirclePlus className="size-4" />
          {buttonText}
        </Button>
      ) : (
        <Link href="/">
          <Button className="w-full md:w-fit">Voltar para a Home</Button>
        </Link>
      )}

      <Modal onClose={() => setIsOpen(false)} />
    </header>
  )
}
