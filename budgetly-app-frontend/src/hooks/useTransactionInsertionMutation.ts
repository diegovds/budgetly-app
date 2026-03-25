import {
  postTransaction,
  PostTransaction200,
  PostTransactionBody,
} from '@/http/api'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useTransactionInsertionMutation() {
  const router = useRouter()

  return useMutation<PostTransaction200, Error, PostTransactionBody, string>({
    mutationFn: (data) => postTransaction(data),
    onMutate: () => {
      return toast.loading('Salvando transação...')
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Transação salva com sucesso!', { id: toastId })
      router.refresh()
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao salvar transação.', {
        id: toastId,
      })
    },
  })
}
