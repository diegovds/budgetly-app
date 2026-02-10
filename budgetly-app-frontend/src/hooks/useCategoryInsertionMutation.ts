import { postCategory, PostCategory200, PostCategoryBody } from '@/http/api'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useCategoryInsertionMutation() {
  const router = useRouter()

  return useMutation<PostCategory200, Error, PostCategoryBody>({
    mutationFn: (data) => postCategory(data),
    onSuccess: () => {
      router.push('/')
    },
  })
}
