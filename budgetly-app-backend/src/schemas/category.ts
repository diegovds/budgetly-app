import z from 'zod'
import { transactionTypeSchema } from './transaction'

export const categorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  type: transactionTypeSchema,
  createdAt: z.iso.datetime(),
})

export const CategorySummarySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  total: z.number(),
})

export type CategorySummary = z.infer<typeof CategorySummarySchema>

export const ListCategoriesSummaryResponseSchema = z.object({
  categories: z.array(CategorySummarySchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    totalCategories: z.number(),
    totalPages: z.number(),
  }),
})

export type ListCategoriesSummaryResponse = z.infer<
  typeof ListCategoriesSummaryResponseSchema
>
