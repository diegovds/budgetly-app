'use client'

import { useModalStore } from '@/store/useModalStore.ts'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NewTransaction } from './transaction/new-transaction'

type ModalProps = {
  onClose: () => void
  title?: string
  // children: React.ReactNode
}

export function Modal({ onClose, title }: ModalProps) {
  const { isOpen, toggleWhoOpened, whoOpened } = useModalStore()
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
        className={`absolute inset-0 bg-black ${
          exiting ? 'overlay-exit' : 'overlay-animate'
        }`}
        onClick={onClose}
        onAnimationEnd={handleAnimationEnd}
      />
      <div
        className={`bg-accent relative z-10 mx-4 w-full max-w-lg rounded-md p-4 ${
          exiting ? 'modal-exit' : 'modal-animate'
        }`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
          )}
          <button onClick={onClose} className="bg-primary rounded-full p-0.5">
            <X size={20} />
          </button>
        </div>
        <div>{whoOpened === '/transaction/new' && <NewTransaction />}</div>
      </div>
    </div>
  )
}
