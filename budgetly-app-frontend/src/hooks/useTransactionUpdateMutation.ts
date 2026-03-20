import {
  patchTransactionId,
  PatchTransactionId200,
  PatchTransactionIdBody,
} from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type useTransactionUpdateMutationType = {
  id: string
  body: PatchTransactionIdBody
}

export function useTransactionUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    PatchTransactionId200,
    Error,
    useTransactionUpdateMutationType
  >({
    mutationFn: (data) => patchTransactionId(data.id, data.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
