import { deleteAccountId, DeleteAccountId200 } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useAccountDeletionMutation() {
  const queryClient = useQueryClient()

  return useMutation<DeleteAccountId200, Error, string, string>({
    mutationFn: (id) => deleteAccountId(id),
    onMutate: () => {
      return toast.loading('Excluindo conta...')
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Conta excluída com sucesso!', { id: toastId })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao excluir conta.', { id: toastId })
    },
  })
}
