import { TransactionType } from '@prisma/client'
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
      monthLabel: format(date, 'MMM', { locale: ptBR }).replace(/^./, (c) =>
        c.toUpperCase(),
      ),
      monthlyResult,
      accumulatedBalance: runningBalance,
    })
  }

  return response
}

type MonthlyIncomeExpense = {
  year: number
  month: number
  monthLabel: string
  income: number
  expense: number
}

export async function getLast6MonthsIncomeExpense(
  userId: string,
): Promise<MonthlyIncomeExpense[]> {
  const now = new Date()
  const periodStart = startOfMonth(subMonths(now, 5))

  // 1️⃣ Agregação no banco
  const result = await prisma.$queryRaw<
    {
      year: number
      month: number
      income: number | null
      expense: number | null
    }[]
  >`
    SELECT
      EXTRACT(YEAR FROM "date")::int as year,
      EXTRACT(MONTH FROM "date")::int as month,
      SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END)::float as income,
      SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END)::float as expense
    FROM "Transaction"
    WHERE "userId" = ${userId}
      AND "date" >= ${periodStart}
      AND "date" <= ${now}
    GROUP BY year, month
    ORDER BY year, month;
  `

  const monthlyMap = new Map<string, { income: number; expense: number }>()

  for (const row of result) {
    monthlyMap.set(`${row.year}-${row.month}`, {
      income: row.income ?? 0,
      expense: row.expense ?? 0,
    })
  }

  // 2️⃣ Garantir 6 meses completos
  const response: MonthlyIncomeExpense[] = []

  for (let i = 5; i >= 0; i--) {
    const date = subMonths(startOfMonth(now), i)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const key = `${year}-${month}`

    const values = monthlyMap.get(key)

    response.push({
      year,
      month,
      monthLabel: format(date, 'MMM', { locale: ptBR }).replace(/^./, (c) =>
        c.toUpperCase(),
      ),
      income: values?.income ?? 0,
      expense: values?.expense ?? 0,
    })
  }

  return response
}

type CategoryExpense = {
  category: string
  total: number
  percentage: number
}

type ExpensesByCategoryResponse = {
  categories: CategoryExpense[]
  othersPercentage: number
  totalExpenses: number
}

export async function getTopExpenseCategories(
  userId: string,
): Promise<ExpensesByCategoryResponse> {
  const result = await prisma.$queryRaw<
    {
      category: string
      total: number
    }[]
  >`
    SELECT 
      c."name" as category,
      SUM(t."amount") as total
    FROM "Transaction" t
    JOIN "Category" c ON c."id" = t."categoryId"
    WHERE 
      t."type" = 'EXPENSE'
      AND t."userId" = ${userId}
    GROUP BY c."name"
    ORDER BY total DESC
  `

  const totalExpenses = result.reduce(
    (acc, item) => acc + Number(item.total),
    0,
  )

  const top4 = result.slice(0, 4)

  const categories = top4.map((item) => ({
    category: item.category,
    total: Number(item.total),
    percentage: totalExpenses
      ? Number(((Number(item.total) / totalExpenses) * 100).toFixed(2))
      : 0,
  }))

  const top4Total = top4.reduce((acc, item) => acc + Number(item.total), 0)

  const othersPercentage = totalExpenses
    ? Number((((totalExpenses - top4Total) / totalExpenses) * 100).toFixed(2))
    : 0

  return {
    categories,
    othersPercentage,
    totalExpenses,
  }
}

type ListCategoriesSummaryProps = {
  userId: string
  type: TransactionType
  page: number
  limit: number
}

type CategorySummary = {
  id: string
  name: string
  total: number
  percentage: number
}

type ListCategoriesSummaryResponse = {
  categories: CategorySummary[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function listCategoriesSummary({
  userId,
  type,
  page,
  limit,
}: ListCategoriesSummaryProps): Promise<ListCategoriesSummaryResponse> {
  const skip = (page - 1) * limit

  const [categoriesGrouped, totalCategories, totalAmount] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type,
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      skip,
      take: limit,
    }),

    prisma.category.count({
      where: {
        userId,
        type,
      },
    }),

    prisma.transaction.aggregate({
      where: {
        userId,
        type,
      },
      _sum: {
        amount: true,
      },
    }),
  ])

  const totalTransactionsAmount = Number(totalAmount._sum.amount ?? 0)

  const categoryIds = categoriesGrouped.map((c) => c.categoryId)

  const categoryData = await prisma.category.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  })

  const categories = categoriesGrouped.map((item) => {
    const category = categoryData.find((c) => c.id === item.categoryId)
    const total = Number(item._sum.amount ?? 0)

    return {
      id: item.categoryId,
      name: category?.name ?? 'Categoria',
      total,
      percentage: totalTransactionsAmount
        ? Number(((total / totalTransactionsAmount) * 100).toFixed(2))
        : 0,
    }
  })

  return {
    categories,
    meta: {
      page,
      limit,
      total: totalCategories,
      totalPages: Math.ceil(totalCategories / limit),
    },
  }
}
