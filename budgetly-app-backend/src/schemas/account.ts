import { AccountType } from '@prisma/client'
import { z } from 'zod'

export const accountTypeSchema = z.enum(AccountType)

export const accountSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: accountTypeSchema,
  balance: z.number().optional(),
  createdAt: z.iso.datetime(),
})

export const listAccountsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(4),
})
