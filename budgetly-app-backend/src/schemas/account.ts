import { z } from 'zod'

export const accountSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: z.enum(['CHECKING', 'CREDIT', 'CASH']),
  createdAt: z.iso.datetime(),
})
