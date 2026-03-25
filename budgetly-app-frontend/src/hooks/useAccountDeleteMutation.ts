import { deleteAccountId, DeleteAccountId200 } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useAccountDeletionMutation() {
  const queryClient = useQueryClient()

  return useMutation<DeleteAccountId200, Error, string>({
    mutationFn: (id) => deleteAccountId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}
