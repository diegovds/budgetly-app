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
      orderBy: { name: 'asc' },
      take,
      skip,
    }),
    prisma.account.count({ where: { userId } }),
  ])

  const accountsWithBalance = await Promise.all(
    accounts.map(async (account) => ({
      ...account,
      type:
        account.type === 'CHECKING'
          ? 'Conta Corrente'
          : account.type === 'CREDIT'
            ? 'Cartão de Crédito'
            : account.type === 'SAVING'
              ? 'Conta Poupança'
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

export async function deleteAccount(id: string) {
  const deletedAccount = await prisma.account.delete({
    where: { id },
  })

  return {
    ...deletedAccount,
    createdAt: deletedAccount.createdAt.toISOString(),
  }
}

export async function updateAccount({
  id,
  name,
}: {
  id: string
  name: string
}) {
  const updatedAccount = await prisma.account.update({
    where: { id },
    data: { name },
  })

  return {
    ...updatedAccount,
    createdAt: updatedAccount.createdAt.toISOString(),
  }
}
