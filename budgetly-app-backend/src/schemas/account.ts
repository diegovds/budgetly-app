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
