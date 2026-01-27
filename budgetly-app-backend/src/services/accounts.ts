import { AccountType, Prisma } from '../lib/generated/prisma/client'
import { prisma } from '../lib/prisma'

type InsertAccountInput = {
  name: string
  type: AccountType
  balance: number
  userId: string
}

export async function insertAccount({
  name,
  type,
  balance,
  userId,
}: InsertAccountInput) {
  return prisma.account.create({
    data: {
      name,
      type,
      balance: new Prisma.Decimal(balance),
      userId,
    },
  })
}
