import { deleteTransactionId, DeleteTransactionId200 } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useTransactionDeletionMutation() {
  const queryClient = useQueryClient()

  return useMutation<DeleteTransactionId200, Error, string, string>({
    mutationFn: (id) => deleteTransactionId(id),
    onMutate: () => {
      return toast.loading('Excluindo transação...')
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Transação excluída com sucesso!', { id: toastId })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao excluir transação.', {
        id: toastId,
      })
    },
  })
}
