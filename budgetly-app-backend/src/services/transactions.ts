import { TransactionType } from '../lib/generated/prisma/client'
import { prisma } from '../lib/prisma'

type InsertTransactionInput = {
  amount: number
  description: string | null
  date: string
  type: TransactionType
  userId: string
  accountId: string
  categoryId: string
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
  const newTransaction = await prisma.transaction.create({
    data: {
      amount,
      date,
      description,
      type,
      userId,
      categoryId,
      accountId,
    },
  })

  return {
    ...newTransaction,
    amount: Number(newTransaction.amount),
    date: newTransaction.date.toISOString(),
    createdAt: newTransaction.createdAt.toISOString(),
  }
}
