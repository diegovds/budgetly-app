import { TransactionType } from '@prisma/client'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { paginationMetaSchema } from '../schemas/transaction'
import {
  getLast12MonthsAccumulatedBalance,
  getLast6MonthsIncomeExpense,
  getTopExpenseCategories,
  listCategoriesSummary,
} from '../services/dashboard'
import { findUserById } from '../services/users'

export const getBalanceLastMonths: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/dashboard/balancelastmonths',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        summary: '',
        response: {
          200: z.array(
            z.object({
              year: z.number(),
              month: z.number(),
              monthLabel: z.string(),
              monthlyResult: z.number(),
              accumulatedBalance: z.number(),
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

        const balanceLastMonths =
          await getLast12MonthsAccumulatedBalance(userId)

        return reply.send(balanceLastMonths)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}

export const getLastMonthsIncomeExpense: FastifyPluginAsyncZod = async (
  app,
) => {
  app.get(
    '/dashboard/lastmonthsincomeexpense',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        summary: '',
        response: {
          200: z.array(
            z.object({
              year: z.number(),
              month: z.number(),
              monthLabel: z.string(),
              income: z.number(),
              expense: z.number(),
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

        const lastMonthsIncomeExpense =
          await getLast6MonthsIncomeExpense(userId)

        return reply.send(lastMonthsIncomeExpense)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}

export const getTopExpense: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/dashboard/gettopexpensecategories',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        summary: '',
        response: {
          200: z.object({
            categories: z.array(
              z.object({
                category: z.string(),
                total: z.number(),
                percentage: z.number(),
              }),
            ),
            othersPercentage: z.number(),
            totalExpenses: z.number(),
          }),
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

        const topExpenseCategories = await getTopExpenseCategories(userId)

        return reply.send(topExpenseCategories)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}

export const getListCategories: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/dashboard/getlistcategories',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        summary: '',
        querystring: z.object({
          type: z.enum(TransactionType),
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(100).default(5),
        }),
        response: {
          200: z.object({
            categories: z.array(
              z.object({
                id: z.uuid(),
                name: z.string(),
                total: z.number(),
                percentage: z.number(),
              }),
            ),
            label: z.string(),
            type: z.enum(TransactionType),
            meta: paginationMetaSchema,
          }),
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
          userId,
          ...query,
        })

        return reply.send(categories)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}
