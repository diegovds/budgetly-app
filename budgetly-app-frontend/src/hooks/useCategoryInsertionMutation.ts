import { postCategory, PostCategory200, PostCategoryBody } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useCategoryInsertionMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<PostCategory200, Error, PostCategoryBody>({
    mutationFn: (data) => postCategory(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['categories', data.type],
      })

      router.refresh()
    },
  })
}
