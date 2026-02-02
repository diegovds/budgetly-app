import { TransactionType } from '../lib/generated/prisma/enums'
import { prisma } from '../lib/prisma'

export async function getAccountBalance(accountId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { accountId },
    select: {
      amount: true,
      type: true,
    },
  })

  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === TransactionType.INCOME
      ? acc + Number(transaction.amount)
      : acc - Number(transaction.amount)
  }, 0)

  return Number(balance.toFixed(2))
}

export async function getMonthlyBalance({
  userId,
  year,
  month,
  accountId,
}: {
  userId: string
  year: number
  month: number // 1-12
  accountId?: string
}) {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      ...(accountId && { accountId }),
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      amount: true,
      type: true,
    },
  })

  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === TransactionType.INCOME
      ? acc + Number(transaction.amount)
      : acc - Number(transaction.amount)
  }, 0)

  return {
    year,
    month,
    balance: Number(balance.toFixed(2)),
  }
}

export async function getBalanceByCategory({
  userId,
  startDate,
  endDate,
  accountId,
}: {
  userId: string
  startDate?: Date
  endDate?: Date
  accountId?: string
}) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      ...(accountId && { accountId }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
    },
    select: {
      amount: true,
      type: true,
      category: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  })

  const categoryMap = new Map<
    string,
    {
      id: string
      name: string
      type: TransactionType
      total: number
    }
  >()

  for (const transaction of transactions) {
    const category = transaction.category

    if (!categoryMap.has(category.id)) {
      categoryMap.set(category.id, {
        id: category.id,
        name: category.name,
        type: category.type,
        total: 0,
      })
    }

    const entry = categoryMap.get(category.id)!

    entry.total +=
      transaction.type === TransactionType.INCOME
        ? Number(transaction.amount)
        : Number(transaction.amount)
  }

  return Array.from(categoryMap.values()).map((c) => ({
    ...c,
    total: Number(c.total.toFixed(2)),
  }))
}
