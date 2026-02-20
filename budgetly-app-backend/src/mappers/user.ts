import { Prisma } from '@prisma/client'
import { getAccountBalance } from '../services/balances'

type UserWithRelations = Prisma.UserGetPayload<{
  select: {
    name: true
    transactions: true
    accounts: true
    categories: true
  }
}>

export async function mapUserForResponse(user: UserWithRelations) {
  return {
    name: user.name,

    accounts: await Promise.all(
      user.accounts.map(async (account) => ({
        id: account.id,
        name: account.name,
        type: account.type,
        balance: await getAccountBalance(account.id),
        createdAt: account.createdAt.toISOString(),
      })),
    ),

    categories: user.categories.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type,
      createdAt: category.createdAt.toISOString(),
    })),

    transactions: user.transactions.map((tx) => ({
      id: tx.id,
      amount: Number(tx.amount),
      description: tx.description,
      date: tx.date.toISOString(),
      type: tx.type,
      createdAt: tx.createdAt.toISOString(),
      accountId: tx.accountId,
      categoryId: tx.categoryId,
    })),
  }
}
