import { TransactionType } from '../lib/generated/prisma/client'
import { prisma } from '../lib/prisma'
import { getAccountById, updateAccountBalance } from './accounts'
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

type DeleleteTransactionInput = {
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
    throw new Error('Categoria não encontrada')
  }

  if (category.type !== type) {
    throw new Error(
      `Tipo da transação (${type}) diferente do tipo da categoria (${category.type})`,
    )
  }

  const account = await getAccountById(accountId, userId)

  if (!account) {
    throw new Error('Conta não encontrada')
  }

  const transaction = await prisma.$transaction(async (tx) => {
    const newTransaction = await tx.transaction.create({
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

    const balanceChange = type === 'INCOME' ? amount : -amount

    await updateAccountBalance(accountId, balanceChange)

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

export async function deleteTransaction({
  id,
  transaction,
}: DeleleteTransactionInput) {
  const deletedTransaction = await prisma.$transaction(async (tx) => {
    const balanceChange =
      transaction.type === 'INCOME' ? -transaction.amount : transaction.amount

    await updateAccountBalance(transaction.accountId, balanceChange)

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
  transaction,
}: UpdateTransactionInput) {
  const updatedTransaction = await prisma.$transaction(async (tx) => {
    const diff = amount - Number(transaction.amount)

    if (diff !== 0) {
      const balanceChange = transaction.type === 'INCOME' ? diff : -diff

      await updateAccountBalance(transaction.accountId, balanceChange)
    }

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
