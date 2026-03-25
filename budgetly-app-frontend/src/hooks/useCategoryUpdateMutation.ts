import {
  patchCategoryId,
  PatchCategoryId200,
  PatchCategoryIdBody,
} from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type useCategoryUpdateMutationType = {
  id: string
  body: PatchCategoryIdBody
}

export function useCategoryUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    PatchCategoryId200,
    Error,
    useCategoryUpdateMutationType
  >({
    mutationFn: (data) => patchCategoryId(data.id, data.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
