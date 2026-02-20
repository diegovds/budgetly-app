import { TransactionType } from '@prisma/client'
import { prisma } from '../lib/prisma'

type FinancialOverviewSummary = {
  totalBalance: number
  monthIncome: number
  monthExpense: number
}

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

function getCurrentMonthRange() {
  const now = new Date()

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  )

  return { startOfMonth, endOfMonth }
}

export async function getFinancialOverviewSummary(
  userId: string,
): Promise<FinancialOverviewSummary> {
  const { startOfMonth, endOfMonth } = getCurrentMonthRange()

  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.INCOME,
      },
      _sum: { amount: true },
    }),

    prisma.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.EXPENSE,
      },
      _sum: { amount: true },
    }),
  ])

  const monthIncomeAgg = await prisma.transaction.aggregate({
    where: {
      userId,
      type: TransactionType.INCOME,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: { amount: true },
  })

  const monthExpenseAgg = await prisma.transaction.aggregate({
    where: {
      userId,
      type: TransactionType.EXPENSE,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: { amount: true },
  })

  const totalIncome = Number(incomeAgg._sum.amount ?? 0)
  const totalExpense = Number(expenseAgg._sum.amount ?? 0)

  const monthIncome = Number(monthIncomeAgg._sum.amount ?? 0)
  const monthExpense = Number(monthExpenseAgg._sum.amount ?? 0)

  return {
    totalBalance: totalIncome - totalExpense,
    monthIncome,
    monthExpense,
  }
}
