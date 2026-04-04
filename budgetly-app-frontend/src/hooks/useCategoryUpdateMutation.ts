import {
  patchCategoryId,
  PatchCategoryId200,
  PatchCategoryIdBody,
} from '@/http/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type useCategoryUpdateMutationType = {
  id: string
  body: PatchCategoryIdBody
}

export function useCategoryUpdateMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<
    PatchCategoryId200,
    Error,
    useCategoryUpdateMutationType,
    string | number
  >({
    mutationFn: (data) => patchCategoryId(data.id, data.body),
    onMutate: () => {
      return toast.loading('Atualizando categoria...')
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Categoria atualizada com sucesso!', { id: toastId })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      router.refresh()
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao atualizar categoria.', {
        id: toastId,
      })
    },
  })
}
