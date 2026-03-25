import { deleteCategoryId, DeleteCategoryId200 } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCategoryDeletionMutation() {
  const queryClient = useQueryClient()

  return useMutation<DeleteCategoryId200, Error, string>({
    mutationFn: (id) => deleteCategoryId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
