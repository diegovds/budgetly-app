import { postAccount, PostAccount200, PostAccountBody } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useAccountInsertionMutation() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation<PostAccount200, Error, PostAccountBody, string | number>({
    mutationFn: (data) => postAccount(data),
    onMutate: () => {
      return toast.loading('Criando conta...')
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Conta criada com sucesso!', { id: toastId })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['my-accounts-accounts'] })
      router.refresh()
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao criar conta.', { id: toastId })
    },
  })
}
