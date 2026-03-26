import { setAuthCookie } from '@/actions/set-auth-cookie'
import { postAuth, PostAuth200, PostAuthBody } from '@/http/api'
import { useAuthStore } from '@/store/auth'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useAuthMutation() {
  const { setToken } = useAuthStore()
  const router = useRouter()

  return useMutation<PostAuth200, Error, PostAuthBody, string | number>({
    mutationFn: (data) => postAuth(data),
    onMutate: () => {
      return toast.loading('Autenticando...')
    },
    onSuccess: async (data) => {
      await setAuthCookie(data.token)
      setToken(data.token)
      router.push('/')
    },
    onError: (error, _, toastId) => {
      toast.error(error.message ?? 'Erro ao fazer login.', { id: toastId })
    },
  })
}
