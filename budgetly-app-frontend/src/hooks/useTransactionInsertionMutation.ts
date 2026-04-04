import {
  postTransaction,
  PostTransaction200,
  PostTransactionBody,
} from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useTransactionInsertionMutation() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation<
    PostTransaction200,
    Error,
    PostTransactionBody,
    string | number
  >({
    mutationFn: (data) => postTransaction(data),
    onMutate: () => {
      return toast.loading('Salvando transação...')
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Transação salva com sucesso!', { id: toastId })
      // transactions page
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      // home page
      queryClient.invalidateQueries({ queryKey: ['summary-information'] })
      queryClient.invalidateQueries({ queryKey: ['my-accounts-accounts'] })
      queryClient.invalidateQueries({
        queryKey: ['my-transactions-categories'],
      })
      queryClient.invalidateQueries({
        queryKey: ['my-transactions-transactions'],
      })
      router.refresh()
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao salvar transação.', {
        id: toastId,
      })
    },
  })
}
