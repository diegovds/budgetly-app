import { postAccount, PostAccount200, PostAccountBody } from '@/http/api'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useAccountInsertionMutation() {
  const router = useRouter()

  return useMutation<PostAccount200, Error, PostAccountBody>({
    mutationFn: (data) => postAccount(data),
    onSuccess: () => {
      router.refresh()
    },
  })
}
