import { TransactionType } from '../lib/generated/prisma/client'
import { prisma } from '../lib/prisma'
import { ListCategoriesSummaryResponse } from '../schemas/category'

type InsertCategoryInput = {
  name: string
  type: TransactionType
  userId: string
}

export async function insertCategory({
  name,
  type,
  userId,
}: InsertCategoryInput) {
  const newCategory = await prisma.category.create({
    data: {
      name,
      type,
      userId,
    },
  })

  return {
    ...newCategory,
    createdAt: newCategory.createdAt.toISOString(),
  }
}

export async function getCategoryById(id: string, userId: string) {
  return await prisma.category.findFirst({
    where: {
      id,
      userId,
    },
  })
}

function getLast30DaysRange() {
  const now = new Date()
  const past = new Date()
  past.setDate(now.getDate() - 30)

  return { startDate: past, endDate: now }
}

type ListCategoriesSummaryProps = {
  userId: string
  page: number
  limit: number
}

export async function listCategoriesSummary({
  userId,
  page,
  limit,
}: ListCategoriesSummaryProps): Promise<ListCategoriesSummaryResponse> {
  const skip = (page - 1) * limit
  const { startDate, endDate } = getLast30DaysRange()

  const [categories, totalCategories] = await Promise.all([
    prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        type: true,
      },
      orderBy: { name: 'asc' },
      skip,
      take: limit,
    }),

    prisma.category.count({
      where: { userId },
    }),
  ])

  const categoriesWithTotal = (
    await Promise.all(
      categories.map(async (category) => {
        const aggregate = await prisma.transaction.aggregate({
          where: {
            userId,
            categoryId: category.id,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: {
            amount: true,
          },
        })

        const rawTotal = Number(aggregate._sum.amount ?? 0)
        const total =
          category.type === TransactionType.EXPENSE ? -rawTotal : rawTotal

        return {
          id: category.id,
          name: category.name,
          type: category.type,
          total,
        }
      }),
    )
  ).sort((a, b) => b.total - a.total)

  return {
    categories: categoriesWithTotal,
    meta: {
      page,
      limit,
      totalCategories,
      totalPages: Math.ceil(totalCategories / limit),
    },
  }
}
