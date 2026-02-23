import { AccountType } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { getAccountBalance } from './balances'

type InsertAccountInput = {
  name: string
  type: AccountType
  userId: string
}

interface getAccountsByUserIdFilters {
  page: number
  limit: number
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

export async function getAccountsByUserId({
  limit = 4,
  page = 1,
  userId,
}: getAccountsByUserIdFilters) {
  const take = Math.min(limit, 100)
  const skip = (page - 1) * take

  const [accounts, total] = await prisma.$transaction([
    prisma.account.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
      take,
      skip,
    }),
    prisma.account.count(),
  ])

  const accountsWithBalance = await Promise.all(
    accounts.map(async (account) => ({
      ...account,
      type:
        account.type === 'CHECKING'
          ? 'Conta Corrente'
          : account.type === 'CREDIT'
            ? 'Cartão de Crédito'
            : 'Dinheiro',
      balance: await getAccountBalance(account.id),
    })),
  )

  return {
    accounts: accountsWithBalance,
    meta: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  }
}
