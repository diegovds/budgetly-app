import { TransactionType } from '../lib/generated/prisma/client'
import { prisma } from '../lib/prisma'

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
