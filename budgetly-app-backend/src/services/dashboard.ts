import { format, startOfMonth, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { prisma } from '../lib/prisma'

type MonthlyBalance = {
  year: number
  month: number
  monthLabel: string
  monthlyResult: number
  accumulatedBalance: number
}

export async function getLast12MonthsAccumulatedBalance(
  userId: string,
): Promise<MonthlyBalance[]> {
  const now = new Date()
  const periodStart = startOfMonth(subMonths(now, 11))

  // 1️⃣ Saldo inicial antes do período (100% no banco)
  const [initialBalanceResult] = await prisma.$queryRaw<
    { balance: number | null }[]
  >`
    SELECT 
      SUM(
        CASE 
          WHEN type = 'INCOME' THEN amount
          WHEN type = 'EXPENSE' THEN -amount
        END
      )::float as balance
    FROM "Transaction"
    WHERE "userId" = ${userId}
      AND "date" < ${periodStart};
  `

  const initialBalance = initialBalanceResult?.balance ?? 0

  // 2️⃣ Resultado mensal apenas dos últimos 12 meses
  const monthlyGrouped = await prisma.$queryRaw<
    { year: number; month: number; result: number }[]
  >`
    SELECT 
      EXTRACT(YEAR FROM "date")::int as year,
      EXTRACT(MONTH FROM "date")::int as month,
      SUM(
        CASE 
          WHEN type = 'INCOME' THEN amount
          WHEN type = 'EXPENSE' THEN -amount
        END
      )::float as result
    FROM "Transaction"
    WHERE "userId" = ${userId}
      AND "date" >= ${periodStart}
      AND "date" <= ${now}
    GROUP BY year, month
    ORDER BY year, month;
  `

  const monthlyMap = new Map<string, number>()

  for (const row of monthlyGrouped) {
    monthlyMap.set(`${row.year}-${row.month}`, row.result)
  }

  // 3️⃣ Running balance progressivo
  const response: MonthlyBalance[] = []
  let runningBalance = initialBalance

  for (let i = 11; i >= 0; i--) {
    const date = subMonths(startOfMonth(now), i)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const key = `${year}-${month}`

    const monthlyResult = monthlyMap.get(key) ?? 0
    runningBalance += monthlyResult

    response.push({
      year,
      month,
      monthLabel: format(date, 'MMM', { locale: ptBR }),
      monthlyResult,
      accumulatedBalance: runningBalance,
    })
  }

  return response
}
