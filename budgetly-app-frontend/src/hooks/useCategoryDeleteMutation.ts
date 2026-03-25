import { deleteCategoryId, DeleteCategoryId200 } from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCategoryDeletionMutation() {
  const queryClient = useQueryClient()

  return useMutation<DeleteCategoryId200, Error, string, string>({
    mutationFn: (id) => deleteCategoryId(id),
    onMutate: () => {
      return toast.loading('Excluindo categoria...')
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Categoria excluída com sucesso!', { id: toastId })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao excluir categoria.', {
        id: toastId,
      })
    },
  })
}
