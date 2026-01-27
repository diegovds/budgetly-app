import z from 'zod'

export const transactionSchema = z.object({
  id: z.uuid(),
  amount: z.number(),
  description: z.string().nullable(),
  date: z.iso.datetime(),
  type: z.enum(['INCOME', 'EXPENSE']),
  createdAt: z.iso.datetime(),

  accountId: z.uuid(),
  categoryId: z.uuid(),
})
