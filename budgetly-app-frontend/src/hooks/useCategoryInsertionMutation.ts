import { postCategory, PostCategory200, PostCategoryBody } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCategoryInsertionMutation() {
  const queryClient = useQueryClient()

  return useMutation<PostCategory200, Error, PostCategoryBody>({
    mutationFn: (data) => postCategory(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['categories', data.type],
      })
    },
  })
}
