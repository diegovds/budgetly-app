export function mapUserForResponse(user: any) {
  return {
    name: user.name,

    accounts: user.accounts.map((account: any) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: Number(account.balance),
      createdAt: account.createdAt.toISOString(),
    })),

    categories: user.categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      type: category.type,
      createdAt: category.createdAt.toISOString(),
    })),

    transactions: user.transactions.map((tx: any) => ({
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
