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
  const newAccount = await prisma.account.create({
    data: {
      name,
      type,
      balance: new Prisma.Decimal(balance),
      userId,
    },
  })

  return {
    ...newAccount,
    balance: Number(newAccount.balance),
    createdAt: newAccount.createdAt.toISOString(),
  }
}
