import z from 'zod'
import { TransactionType } from '../lib/generated/prisma/client'

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

export const listTransactionsSchema = z
  .object({
    accountId: z.uuid().optional(),
    categoryId: z.uuid().optional(),

    type: z.enum(TransactionType).optional(),

    startDate: z.iso.datetime().optional(),
    endDate: z.iso.datetime().optional(),

    minAmount: z.coerce.number().positive().optional(),
    maxAmount: z.coerce.number().positive().optional(),

    search: z.string().min(1).optional(),

    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),

    orderBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
    order: z.enum(['asc', 'desc']).default('desc'),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      if (new Date(data.startDate) > new Date(data.endDate)) {
        ctx.addIssue({
          code: 'custom',
          path: ['startDate'],
          message: 'startDate must be before endDate',
        })
      }
    }

    if (data.minAmount && data.maxAmount) {
      if (data.minAmount > data.maxAmount) {
        ctx.addIssue({
          code: 'custom',
          path: ['minAmount'],
          message: 'minAmount must be less than maxAmount',
        })
      }
    }
  })

export const paginationMetaSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
})
