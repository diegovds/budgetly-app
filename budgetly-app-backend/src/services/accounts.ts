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

export async function updateAccountBalance(id: string, amount: number) {
  return await prisma.account.update({
    where: { id },
    data: {
      balance: {
        increment: amount,
      },
    },
  })
}

export async function getAccountById(id: string, userId: string) {
  return await prisma.account.findFirst({
    where: {
      id,
      userId,
    },
  })
}
