import {
  patchUserPassword,
  PatchUserPassword200,
  PatchUserPasswordBody,
} from '@/http/api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useChangePasswordMutation() {
  return useMutation<PatchUserPassword200, Error, PatchUserPasswordBody>({
    mutationFn: (data) => patchUserPassword(data),
    onMutate: () => {
      return toast.loading('Atualizando senha...')
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Senha atualizada com sucesso.', { id: toastId as string })
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao atualizar senha.', {
        id: toastId as string,
      })
    },
  })
}
