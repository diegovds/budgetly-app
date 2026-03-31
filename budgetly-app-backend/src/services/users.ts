import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export async function insertUser({
  email,
  name,
  password,
}: Prisma.UserCreateInput) {
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password,
    },
  })

  return newUser
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  })
}

export async function findUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      accounts: true,
      categories: true,
      transactions: true,
    },
  })
}

export async function findUserWithPasswordById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, password: true },
  })
}

export async function updateUserPassword(id: string, passwordHash: string) {
  return await prisma.user.update({
    where: { id },
    data: { password: passwordHash },
  })
}

export async function getUserStats(id: string) {
  const [
    accountsCount,
    incomeCategoriesCount,
    expenseCategoriesCount,
    transactionsCount,
  ] = await Promise.all([
    prisma.account.count({ where: { userId: id } }),
    prisma.category.count({ where: { userId: id, type: 'INCOME' } }),
    prisma.category.count({ where: { userId: id, type: 'EXPENSE' } }),
    prisma.transaction.count({ where: { userId: id } }),
  ])

  return { accountsCount, incomeCategoriesCount, expenseCategoriesCount, transactionsCount }
}
