import { formatCurrency } from '@/utils/format'
import { Account } from './account'

type MyAccountsProps = {
  accounts: {
    id: string
    name: string
    balance: number
  }[]
  totalBalance: number
}

export function MyAccounts({ accounts, totalBalance }: MyAccountsProps) {
  return (
    <div className="bg-accent flex-1 rounded p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Minhas Contas</h2>
        <p className="text-muted-foreground text-sm">
          Total: {formatCurrency(totalBalance)}
        </p>
      </div>
      <div className="mt-4 space-y-6">
        {accounts.map((account) => (
          <Account key={account.id} account={account} />
        ))}
      </div>
    </div>
  )
}
