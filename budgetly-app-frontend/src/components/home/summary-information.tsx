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
    <div className="grid gap-4 md:grid-cols-3 lg:gap-8">
      <BalanceInformation
        balance={totalBalance}
        icon={<Landmark size={20} />}
        text="Saldo Total"
      />
      <BalanceInformation
        balance={monthIncome}
        icon={<Banknote size={20} />}
        text="Receitas do mês"
      />
      <BalanceInformation
        balance={monthExpense}
        icon={<ShoppingCart size={20} />}
        text="Despesas do mês"
      />
    </div>
  )
}
