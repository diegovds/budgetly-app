export function mapAccountForResponse(account: any) {
  return {
    account: {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: Number(account.balance),
      createdAt: account.createdAt.toISOString(),
    },
  }
}
