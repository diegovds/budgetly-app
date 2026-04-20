'use client'

import { useModalStore } from '@/store/useModalStore.ts'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AccountManagement } from './account/account-management'
import { CategoryManagement } from './category/category-management'
import { NewCategory } from './category/new-category'
import { NewAccount } from './new-account'
import { NewTransaction } from './transaction/new-transaction'
import { TransactionManagement } from './transaction/transaction-management'

type ModalProps = {
  onClose: () => void
}

const MODAL_TITLES: Record<string, string> = {
  '/transaction/new': 'Adicionar Transação',
  '/account/new': 'Adicionar Conta',
  '/category/new': 'Adicionar Categoria',
  'account/manage': 'Gerenciamento de Conta',
  'category/manage': 'Gerenciamento de Categoria',
  'transaction/delete': 'Gerenciamento de Transação',
}

const MODAL_CONTENT: Record<string, React.ReactNode> = {
  '/transaction/new': <NewTransaction />,
  '/account/new': <NewAccount />,
  '/category/new': <NewCategory />,
  'account/manage': <AccountManagement />,
  'category/manage': <CategoryManagement />,
  'transaction/delete': <TransactionManagement />,
}

export function Modal({ onClose }: ModalProps) {
  const { isOpen, toggleWhoOpened, whoOpened, toggleElement } = useModalStore()
  const [show, setShow] = useState(isOpen)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
      setExiting(false)
    } else if (show) {
      setExiting(true)
    }
  }, [isOpen, show])

  const handleAnimationEnd = () => {
    if (exiting) {
      setShow(false)
      toggleWhoOpened()
      toggleElement()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!show) return null

  const overlayClass = `absolute inset-0 bg-black ${exiting ? 'overlay-exit' : 'overlay-animate'}`
  const panelClass = `bg-card relative z-10 mx-4 w-full max-w-lg rounded-xl p-5 ${exiting ? 'modal-exit' : 'modal-animate'}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={overlayClass}
        onClick={onClose}
        onAnimationEnd={handleAnimationEnd}
      />
      <div className={panelClass} onAnimationEnd={handleAnimationEnd}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-(family-name:--font-serif-display) text-xl md:text-2xl">
            {MODAL_TITLES[whoOpened]}
          </h2>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer rounded-lg p-1.5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="border-border/50 border-t pt-5">
          {MODAL_CONTENT[whoOpened]}
        </div>
      </div>
    </div>
  )
}
