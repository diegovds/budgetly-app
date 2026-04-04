import { TransactionType } from '@prisma/client'
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

type ListCategoriesSummaryProps = {
  userId: string
  page: number
  limit: number
  type?: TransactionType
  orderBy?: 'name' | 'total'
  order?: 'asc' | 'desc'
  dateRange?: '30d' | 'all'
}

export async function listCategoriesSummary({
  userId,
  page,
  limit,
  type,
  orderBy,
  order,
  dateRange = '30d',
}: ListCategoriesSummaryProps): Promise<ListCategoriesSummaryResponse> {
  const skip = (page - 1) * limit

  let dateFilter: { gte: Date; lte: Date } | undefined
  if (dateRange === '30d') {
    const now = new Date()
    const past = new Date()
    past.setDate(now.getDate() - 30)
    dateFilter = { gte: past, lte: now }
  }

  const [allCategories, totalCategories] = await Promise.all([
    prisma.category.findMany({
      where: { userId, type },
      select: {
        id: true,
        name: true,
        type: true,
      },
    }),

    prisma.category.count({
      where: { userId, type },
    }),
  ])

  const categoriesWithTotal = await Promise.all(
    allCategories.map(async (category) => {
      const aggregate = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: category.id,
          ...(dateFilter ? { date: dateFilter } : {}),
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

  if (orderBy === 'total') {
    categoriesWithTotal.sort((a, b) => b.total - a.total)
  } else {
    categoriesWithTotal.sort((a, b) =>
      order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    )
  }

  const paginated = categoriesWithTotal.slice(skip, skip + limit)

  return {
    categories: paginated,
    meta: {
      page,
      limit,
      totalCategories,
      totalPages: Math.ceil(totalCategories / limit),
    },
  }
}

export async function deleteCategory(id: string) {
  const deletedCategory = await prisma.category.delete({
    where: { id },
  })

  return {
    ...deletedCategory,
    createdAt: deletedCategory.createdAt.toISOString(),
  }
}

export async function updateCategory({
  id,
  name,
}: {
  id: string
  name: string
}) {
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { name },
  })

  return {
    ...updatedCategory,
    createdAt: updatedCategory.createdAt.toISOString(),
  }
}
