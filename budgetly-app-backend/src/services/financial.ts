import { Prisma } from '../lib/generated/prisma/client'
import { prisma } from '../lib/prisma'
import {
    FinancialOverviewAccount,
    ListFinancialOverviewResponse,
} from '../schemas/financial-overview'
import { ListTransactionsFilters } from './transactions'

export async function listFinancialOverview(
  filters: ListTransactionsFilters,
): Promise<ListFinancialOverviewResponse> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 10
  const skip = (page - 1) * limit

  const orderBy: Prisma.TransactionOrderByWithRelationInput = (() => {
    if (filters.orderBy && filters.order) {
      return { [filters.orderBy]: filters.order }
    }
    return { date: 'desc' }
  })()

  const whereTransaction: Prisma.TransactionWhereInput = {
    userId: filters.userId,

    ...(filters.accountId && { accountId: filters.accountId }),
    ...(filters.categoryId && { categoryId: filters.categoryId }),
    ...(filters.type && { type: filters.type }),

    ...(filters.startDate || filters.endDate
      ? {
          date: {
            ...(filters.startDate && {
              gte: new Date(filters.startDate),
            }),
            ...(filters.endDate && {
              lte: new Date(filters.endDate),
            }),
          },
        }
      : {}),

    ...(filters.minAmount !== undefined || filters.maxAmount !== undefined
      ? {
          amount: {
            ...(filters.minAmount !== undefined && {
              gte: filters.minAmount,
            }),
            ...(filters.maxAmount !== undefined && {
              lte: filters.maxAmount,
            }),
          },
        }
      : {}),

    ...(filters.search && {
      description: {
        contains: filters.search,
        mode: 'insensitive',
      },
    }),
  }

  const transactions = await prisma.transaction.findMany({
    where: whereTransaction,
    include: {
      account: true,
      category: true,
    },
    orderBy,
    skip,
    take: limit,
  })

  const totalTransactions = await prisma.transaction.count({
    where: whereTransaction,
  })

  const accountsMap = new Map<string, FinancialOverviewAccount>()

  for (const tx of transactions) {
    if (!accountsMap.has(tx.accountId)) {
      accountsMap.set(tx.accountId, {
        id: tx.account.id,
        name: tx.account.name,
        balance: Number(tx.account.balance),
        categories: [],
      })
    }

    const account = accountsMap.get(tx.accountId)!

    let category = account.categories.find((c) => c.id === tx.categoryId)

    if (!category) {
      category = {
        id: tx.category.id,
        name: tx.category.name,
        type: tx.category.type,
        transactions: [],
      }
      account.categories.push(category)
    }

    category.transactions.push({
      id: tx.id,
      amount: Number(tx.amount),
      description: tx.description,
      date: tx.date.toISOString(),
      type: tx.type,
      createdAt: tx.createdAt.toISOString(),
      accountId: tx.accountId,
      categoryId: tx.categoryId,
    })
  }

  return {
    accounts: Array.from(accountsMap.values()),
    meta: {
      page,
      limit,
      totalTransactions,
      totalPages: Math.ceil(totalTransactions / limit),
    },
  }
}
