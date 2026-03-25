import { postAccount, PostAccount200, PostAccountBody } from '@/http/api'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useAccountInsertionMutation() {
  const router = useRouter()

  return useMutation<PostAccount200, Error, PostAccountBody, string>({
    mutationFn: (data) => postAccount(data),
    onMutate: () => {
      return toast.loading('Criando conta...')
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Conta criada com sucesso!', { id: toastId })
      router.refresh()
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao criar conta.', { id: toastId })
    },
  })
}
