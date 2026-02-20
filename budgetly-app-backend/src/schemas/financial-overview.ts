import { TransactionType } from '@prisma/client'
import { z } from 'zod'

const transactionTypeSchema = z.enum(TransactionType)

export const financialOverviewTransactionSchema = z.object({
  id: z.uuid(),
  amount: z.number(),
  description: z.string().nullable(),
  date: z.string(),
  type: transactionTypeSchema,
  createdAt: z.string(),
  accountId: z.uuid(),
  categoryId: z.uuid(),
})

export const financialOverviewCategorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: transactionTypeSchema,
  transactions: z.array(financialOverviewTransactionSchema),
})

export const financialOverviewAccountSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  balance: z.number(),
  categories: z.array(financialOverviewCategorySchema),
})

export const listFinancialOverviewResponseSchema = z.object({
  accounts: z.array(financialOverviewAccountSchema),
  meta: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    totalTransactions: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
})

export type ListFinancialOverviewResponse = z.infer<
  typeof listFinancialOverviewResponseSchema
>

export type FinancialOverviewAccount = z.infer<
  typeof financialOverviewAccountSchema
>
