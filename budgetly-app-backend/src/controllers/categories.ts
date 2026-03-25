import { TransactionType } from '@prisma/client'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
  categorySchema,
  ListCategoriesSummaryResponseSchema,
} from '../schemas/category'
import { transactionTypeSchema } from '../schemas/transaction'
import { deleteCategory, getCategoryById, insertCategory, listCategoriesSummary, updateCategory } from '../services/categories'
import { findUserById } from '../services/users'

export const createCategory: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/category',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Category'],
        security: [{ bearerAuth: [] }],
        summary: 'Cria uma nova categoria para o usuário autenticado.',
        body: z.object({
          name: z
            .string()
            .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
          type: transactionTypeSchema,
        }),
        response: {
          200: categorySchema,
          401: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = request.user.sub
        const user = await findUserById(userId)

        if (!user) {
          return reply.status(404).send({ message: 'Usuário não encontrado.' })
        }

        const { name, type } = request.body

        const newCategory = await insertCategory({
          name,
          type,
          userId,
        })

        return reply.send(newCategory)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}

export const listCategories: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/category',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Category'],
        security: [{ bearerAuth: [] }],
        summary: 'Lista um resumo das categorias do usuário autenticado.',
        querystring: z.object({
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(100).default(6),
          type: z.enum(TransactionType).optional(),
          orderBy: z.enum(['name', 'total']).optional().default('name'),
          order: z.enum(['asc', 'desc']).optional().default('asc'),
        }),
        response: {
          200: ListCategoriesSummaryResponseSchema,
          401: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = request.user.sub
        const user = await findUserById(userId)
        const query = request.query

        if (!user) {
          return reply.status(404).send({ message: 'Usuário não encontrado.' })
        }

        const categories = await listCategoriesSummary({
          ...query,
          userId,
        })

        return reply.send(categories)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}

export const getCategoryTypes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/category/types',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Category'],
        security: [{ bearerAuth: [] }],
        summary: 'Lista os tips de categoria disponíveis',
        response: {
          200: z.array(
            z.object({
              value: z.string(),
              label: z.string(),
            }),
          ),
          401: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = request.user.sub
        const user = await findUserById(userId)

        if (!user) {
          return reply.status(404).send({ message: 'Usuário não encontrado.' })
        }

        return Object.values(TransactionType).map((type) => ({
          value: type,
          label: type === 'INCOME' ? 'Receita' : 'Despesa',
        }))
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}

export const dropCategory: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/category/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Category'],
        security: [{ bearerAuth: [] }],
        summary: 'Exclui uma categoria pelo ID para o usuário autenticado.',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: categorySchema,
          401: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const userId = request.user.sub
        const user = await findUserById(userId)

        if (!user) {
          return reply.status(404).send({ message: 'Usuário não encontrado.' })
        }

        const category = await getCategoryById(id, userId)

        if (!category) {
          return reply.status(404).send({ message: 'Categoria não encontrada.' })
        }

        const deletedCategory = await deleteCategory(id)

        return reply.send(deletedCategory)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}

export const updateCategory_: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/category/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Category'],
        security: [{ bearerAuth: [] }],
        summary: 'Atualiza uma categoria pelo ID para o usuário autenticado.',
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          name: z
            .string()
            .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
        }),
        response: {
          200: categorySchema,
          401: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const { name } = request.body
        const userId = request.user.sub
        const user = await findUserById(userId)

        if (!user) {
          return reply.status(404).send({ message: 'Usuário não encontrado.' })
        }

        const category = await getCategoryById(id, userId)

        if (!category || category.userId !== userId) {
          return reply.status(404).send({ message: 'Categoria não encontrada.' })
        }

        const updatedCategory = await updateCategory({ id, name })

        return reply.send(updatedCategory)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}
