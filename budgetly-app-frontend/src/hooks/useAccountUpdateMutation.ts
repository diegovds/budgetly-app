import {
  patchAccountId,
  PatchAccountId200,
  PatchAccountIdBody,
} from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type useAccountUpdateMutationType = {
  id: string
  body: PatchAccountIdBody
}

export function useAccountUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation<PatchAccountId200, Error, useAccountUpdateMutationType>({
    mutationFn: (data) => patchAccountId(data.id, data.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}
