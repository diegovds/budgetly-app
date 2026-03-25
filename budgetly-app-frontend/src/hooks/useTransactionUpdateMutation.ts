import {
  patchTransactionId,
  PatchTransactionId200,
  PatchTransactionIdBody,
} from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type useTransactionUpdateMutationType = {
  id: string
  body: PatchTransactionIdBody
}

export function useTransactionUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    PatchTransactionId200,
    Error,
    useTransactionUpdateMutationType,
    string
  >({
    mutationFn: (data) => patchTransactionId(data.id, data.body),
    onMutate: () => {
      return toast.loading('Atualizando transação...')
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Transação atualizada com sucesso!', { id: toastId })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao atualizar transação.', {
        id: toastId,
      })
    },
  })
}
