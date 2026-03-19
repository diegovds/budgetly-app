import { deleteTransactionId, DeleteTransactionId200 } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useTransactionDeletionMutation() {
  const queryClient = useQueryClient()

  return useMutation<DeleteTransactionId200, Error, string>({
    mutationFn: (id) => deleteTransactionId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
