import {
  patchAccountId,
  PatchAccountId200,
  PatchAccountIdBody,
} from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type useAccountUpdateMutationType = {
  id: string
  body: PatchAccountIdBody
}

export function useAccountUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    PatchAccountId200,
    Error,
    useAccountUpdateMutationType,
    string
  >({
    mutationFn: (data) => patchAccountId(data.id, data.body),
    onMutate: () => {
      return toast.loading('Atualizando conta...')
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Conta atualizada com sucesso!', { id: toastId })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao atualizar conta.', { id: toastId })
    },
  })
}
