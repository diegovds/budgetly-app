import { AccountType } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { getAccountBalance } from './balances'

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

export async function getAccountsByUserId(userId: string) {
  const accounts = await prisma.account.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
    },
  })

  const accountsWithBalance = await Promise.all(
    accounts.map(async (account) => ({
      ...account,
      balance: await getAccountBalance(account.id),
    })),
  )

  return accountsWithBalance
}
