import { z } from 'zod'

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.url(),
})

const clientEnv = {
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
}

// Valida as variáveis
export const env = clientEnvSchema.parse(clientEnv)
