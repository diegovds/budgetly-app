import { setAuthCookie } from '@/actions/set-auth-cookie'
import { postAuth, PostAuth200, PostAuthBody } from '@/http/api'
import { useAuthStore } from '@/store/auth'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useAuthMutation() {
  const { setToken } = useAuthStore()
  const router = useRouter()

  return useMutation<PostAuth200, Error, PostAuthBody>({
    mutationFn: (data) => postAuth(data),
    onSuccess: async (data) => {
      await setAuthCookie(data.token)
      setToken(data.token)
      router.push('/')
    },
  })
}
