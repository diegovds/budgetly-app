'use client'

import { useModalStore } from '@/store/useModalStore.ts'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NewCategory } from './category/new-category'
import { NewAccount } from './new-account'
import { DeleteTransaction } from './transaction/delete-transaction'
import { NewTransaction } from './transaction/new-transaction'

type ModalProps = {
  onClose: () => void
  // children: React.ReactNode
}

export function Modal({ onClose }: ModalProps) {
  const { isOpen, toggleWhoOpened, whoOpened, toggleElement } = useModalStore()
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
      toggleElement()
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
        className={`bg-accent relative z-10 mx-4 w-full max-w-lg rounded p-4 ${
          exiting ? 'modal-exit' : 'modal-animate'
        }`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold md:text-xl">
            {whoOpened === '/transaction/new'
              ? 'Adicionar Transação'
              : whoOpened === '/account/new'
                ? 'Adicionar Conta'
                : whoOpened === '/category/new'
                  ? 'Adicionar Categoria'
                  : 'Gerenciamento de Transação'}
          </h2>

          <button
            onClick={onClose}
            className="bg-primary flex size-6 cursor-pointer items-center justify-center rounded-full"
          >
            <X size={14} />
          </button>
        </div>
        <div>
          {whoOpened === '/transaction/new' ? (
            <NewTransaction />
          ) : whoOpened === '/account/new' ? (
            <NewAccount />
          ) : whoOpened === '/category/new' ? (
            <NewCategory />
          ) : (
            <DeleteTransaction />
          )}
        </div>
      </div>
    </div>
  )
}
