'use client'

import { useTransactionDeletionMutation } from '@/hooks/useTransactionDeleteMutation'
import { useModalStore } from '@/store/useModalStore.ts'
import { Button } from '../ui/button'

export function DeleteTransaction() {
  const { mutate, isPending, error, isSuccess } =
    useTransactionDeletionMutation()
  const { element, toggleIsOpen } = useModalStore()

  return (
    <div className="space-y-6 rounded border p-4">
      {element && element.type === 'transaction' && (
        <>
          <h3 className="text-sm">
            Tem certeza que deseja delatar a Transação{' '}
            <strong>{element.data.description}</strong>?
          </h3>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="text-xs md:text-sm"
              onClick={() => {
                toggleIsOpen()
              }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="destructive"
              className="text-xs md:text-sm"
              disabled={isPending || isSuccess}
              onClick={() => {
                mutate(element.data.id)
                toggleIsOpen()
              }}
            >
              Deletar Transação
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
