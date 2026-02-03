import { Banknote, Landmark, ShoppingCart } from 'lucide-react'
import { BalanceInformation } from './balance-information'

type SummaryInformationProps = {
  monthExpense: number
  monthIncome: number
  totalBalance: number
}

export function SummaryInformation({
  monthExpense,
  monthIncome,
  totalBalance,
}: SummaryInformationProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:gap-8">
      <BalanceInformation
        balance={totalBalance}
        icon={<Landmark />}
        text="Saldo Total"
      />
      <BalanceInformation
        balance={monthIncome}
        icon={<Banknote />}
        text="Receitas do mês"
      />
      <BalanceInformation
        balance={monthExpense}
        icon={<ShoppingCart />}
        text="Despesas do mês"
      />
    </div>
  )
}
