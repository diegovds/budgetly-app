import { deleteCategoryId, DeleteCategoryId200 } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useCategoryDeletionMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<DeleteCategoryId200, Error, string, string | number>({
    mutationFn: (id) => deleteCategoryId(id),
    onMutate: () => {
      return toast.loading('Excluindo categoria...')
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Categoria excluída com sucesso!', { id: toastId })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      router.refresh()
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao excluir categoria.', {
        id: toastId,
      })
    },
  })
}
