import {
  postTransaction,
  PostTransaction200,
  PostTransactionBody,
} from '@/http/api'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useTransactionInsertionMutation() {
  const router = useRouter()

  return useMutation<PostTransaction200, Error, PostTransactionBody>({
    mutationFn: (data) => postTransaction(data),
    onSuccess: () => {
      router.refresh()
    },
  })
}
