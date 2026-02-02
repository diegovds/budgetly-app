import { AccountType } from '../lib/generated/prisma/client'
import { prisma } from '../lib/prisma'

type InsertAccountInput = {
  name: string
  type: AccountType
  userId: string
}

export async function insertAccount({
  name,
  type,
  userId,
}: InsertAccountInput) {
  const newAccount = await prisma.account.create({
    data: {
      name,
      type,
      userId,
    },
  })

  return {
    ...newAccount,
    createdAt: newAccount.createdAt.toISOString(),
  }
}

export async function getAccountById(id: string, userId: string) {
  return await prisma.account.findFirst({
    where: {
      id,
      userId,
    },
  })
}
