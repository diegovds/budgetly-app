'use client'

import { useModalStore } from '@/store/useModalStore.ts'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

type ModalProps = {
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ onClose, title, children }: ModalProps) {
  const { isOpen, toggleWhoOpened } = useModalStore()
  const [show, setShow] = useState(isOpen)
  const [exiting, setExiting] = useState(false)

  // Controla abertura e início da saída
  useEffect(() => {
    if (isOpen) {
      setShow(true)
      setExiting(false)
    } else if (show) {
      setExiting(true)
    }
  }, [isOpen, show])

  // Fecha o modal do DOM após animação de saída
  const handleAnimationEnd = () => {
    if (exiting) {
      setShow(false)
      toggleWhoOpened()
    }
  }

  // Fecha com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`bg-overlay absolute inset-0 ${
          exiting ? 'overlay-exit' : 'overlay-animate'
        }`}
        onClick={onClose}
        onAnimationEnd={handleAnimationEnd}
      />
      <div
        className={`bg-secondary text-foreground relative z-10 mx-4 w-full max-w-lg rounded-2xl p-5 shadow-xl md:p-8 ${
          exiting ? 'modal-exit' : 'modal-animate'
        }`}
        onAnimationEnd={handleAnimationEnd}
      >
        <X
          onClick={onClose}
          className="bg-foreground text-secondary absolute top-3 right-3 cursor-pointer rounded-full p-1 text-2xl duration-300 hover:opacity-95 md:text-3xl"
        />
        {title && <h2 className="text-foreground mb-4 text-xl">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  )
}
