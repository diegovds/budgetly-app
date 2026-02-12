import { z } from 'zod'
import { AccountType } from '../lib/generated/prisma/enums'

export const accountTypeSchema = z.enum(AccountType)

export type AccountType_ = z.infer<typeof accountTypeSchema>

export const accountSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: accountTypeSchema,
  balance: z.number().optional(),
  createdAt: z.iso.datetime(),
})
