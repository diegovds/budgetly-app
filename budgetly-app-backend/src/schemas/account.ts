import { z } from 'zod'

export const accountSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: z.enum(['CHECKING', 'CREDIT', 'CASH']),
  balance: z.number().optional(),
  createdAt: z.iso.datetime(),
})
