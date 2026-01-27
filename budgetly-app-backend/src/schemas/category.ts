import z from 'zod'

export const categorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: z.enum(['INCOME', 'EXPENSE']),
  createdAt: z.iso.datetime(),
})
