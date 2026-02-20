import { Prisma, TransactionType } from '@prisma/client'
import { BadRequestError, NotFoundError } from '../errors/http'
import { prisma } from '../lib/prisma'
import { ListTransactionsSummaryResponse } from '../schemas/transaction'
import { getAccountById } from './accounts'
import { getCategoryById } from './categories'

type InsertTransactionInput = {
  amount: number
  description: string | null
  date: string
  type: TransactionType
  userId: string
  accountId: string
  categoryId: string
}

type DeleteTransactionInput = {
  id: string
  transaction: InsertTransactionInput
}

type UpdateTransactionInput = {
  id: string
  amount: number
  description: string | null
  date: string
  transaction: InsertTransactionInput
}

export type ListTransactionsFilters = {
  userId: string
  accountId?: string
  categoryId?: string
  type?: TransactionType
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  search?: string
  page?: number
  limit?: number
  orderBy?: 'date' | 'amount' | 'createdAt'
  order?: 'asc' | 'desc'
}

export async function insertTransaction({
  accountId,
  amount,
  categoryId,
  date,
  description,
  type,
  userId,
}: InsertTransactionInput) {
  const category = await getCategoryById(categoryId, userId)

  if (!category) {
    throw new NotFoundError('Categoria não encontrada')
  }

  if (category.type !== type) {
    throw new BadRequestError(
      `Tipo da transação (${type}) diferente do tipo da categoria (${category.type})`,
    )
  }

  const account = await getAccountById(accountId, userId)

  if (!account) {
    throw new NotFoundError('Conta não encontrada')
  }

  const transaction = await prisma.$transaction(async (tx) => {
    const newTransaction = await tx.transaction.create({
      data: {
        amount,
        date: new Date(date),
        description,
        type,
        userId,
        categoryId,
        accountId,
      },
    })

    return newTransaction
  })

  return {
    ...transaction,
    amount: Number(transaction.amount),
    date: transaction.date.toISOString(),
    createdAt: transaction.createdAt.toISOString(),
  }
}

export async function getTransactionById(id: string) {
  return await prisma.transaction.findUnique({
    where: { id },
  })
}

export async function deleteTransaction({ id }: DeleteTransactionInput) {
  const deletedTransaction = await prisma.$transaction(async (tx) => {
    return await tx.transaction.delete({
      where: { id },
    })
  })

  return {
    ...deletedTransaction,
    amount: Number(deletedTransaction.amount),
    date: deletedTransaction.date.toISOString(),
    createdAt: deletedTransaction.createdAt.toISOString(),
  }
}

export async function updateTransaction({
  amount,
  date,
  description,
  id,
}: UpdateTransactionInput) {
  const updatedTransaction = await prisma.$transaction(async (tx) => {
    return await tx.transaction.update({
      where: { id },
      data: {
        amount,
        date,
        description,
      },
    })
  })

  return {
    ...updatedTransaction,
    amount: Number(updatedTransaction.amount),
    date: updatedTransaction.date.toISOString(),
    createdAt: updatedTransaction.createdAt.toISOString(),
  }
}

export async function listTransactions(filters: ListTransactionsFilters) {
  const {
    userId,
    accountId,
    categoryId,
    type,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    search,
    page = 1,
    limit = 20,
    orderBy = 'date',
    order = 'desc',
  } = filters

  const where: Prisma.TransactionWhereInput = {
    userId,

    ...(accountId && { accountId }),
    ...(categoryId && { categoryId }),
    ...(type && { type }),

    ...(startDate || endDate
      ? {
          date: {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
          },
        }
      : {}),

    ...(minAmount || maxAmount
      ? {
          amount: {
            ...(minAmount && { gte: minAmount }),
            ...(maxAmount && { lte: maxAmount }),
          },
        }
      : {}),

    ...(search && {
      description: {
        contains: search,
        mode: 'insensitive',
      },
    }),
  }

  const take = Math.min(limit, 100)
  const skip = (page - 1) * take

  const [transactions, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      include: {
        account: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      where,
      take,
      skip,
      orderBy: {
        [orderBy]: order,
      },
    }),
    prisma.transaction.count({ where }),
  ])

  return {
    transactions: transactions.map((t) => ({
      ...t,
      amount:
        t.type === TransactionType.EXPENSE
          ? -Number(t.amount)
          : Number(t.amount),
      date: t.date.toISOString(),
      createdAt: t.createdAt.toISOString(),
      accountName: t.account.name,
      categoryName: t.category.name,
    })),
    meta: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  }
}

type ListCategoriesSummaryProps = {
  userId: string
  page: number
  limit: number
}

export async function listRecentTransactions({
  limit,
  page,
  userId,
}: ListCategoriesSummaryProps): Promise<ListTransactionsSummaryResponse> {
  const skip = (page - 1) * limit

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        description: true,
        amount: true,
        date: true,
        type: true,
      },
      orderBy: {
        date: 'desc',
      },
      skip,
      take: limit,
    }),

    prisma.transaction.count({
      where: {
        userId,
      },
    }),
  ])

  return {
    transactions: transactions.map((tx) => ({
      id: tx.id,
      name: tx.description ?? 'Transação',
      amount:
        tx.type === TransactionType.EXPENSE
          ? -Number(tx.amount)
          : Number(tx.amount),
      date: tx.date.toISOString(),
    })),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
