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

type UpdateTransactionInput = {
  id: string
  amount: number
  description: string | null
  date: string
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

export async function getTransactionById(id: string) {
  return await prisma.transaction.findUnique({
    where: { id },
  })
}

export async function deleteTransaction(id: string) {
  const deleteTransaction = await prisma.transaction.delete({ where: { id } })

  return {
    ...deleteTransaction,
    amount: Number(deleteTransaction.amount),
    date: deleteTransaction.date.toISOString(),
    createdAt: deleteTransaction.createdAt.toISOString(),
  }
}

export async function updateTransaction({
  amount,
  date,
  description,
  id,
}: UpdateTransactionInput) {
  const updateTransaction = await prisma.transaction.update({
    where: { id },
    data: {
      amount,
      date,
      description,
    },
  })

  return {
    ...updateTransaction,
    amount: Number(updateTransaction.amount),
    date: updateTransaction.date.toISOString(),
    createdAt: updateTransaction.createdAt.toISOString(),
  }
}
