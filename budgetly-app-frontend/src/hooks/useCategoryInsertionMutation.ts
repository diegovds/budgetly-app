import { postCategory, PostCategory200, PostCategoryBody } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useCategoryInsertionMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<PostCategory200, Error, PostCategoryBody, string | number>({
    mutationFn: (data) => postCategory(data),
    onMutate: () => {
      return toast.loading('Criando categoria...')
    },
    onSuccess: (data, _, toastId) => {
      toast.success('Categoria criada com sucesso!', { id: toastId })
      queryClient.invalidateQueries({
        queryKey: ['categories', data.type],
      })
      router.refresh()
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao criar categoria.', { id: toastId })
    },
  })
}
