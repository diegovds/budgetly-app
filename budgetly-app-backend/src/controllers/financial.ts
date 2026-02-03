import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { listFinancialOverviewResponseSchema } from '../schemas/financial-overview'
import { listTransactionsSchema } from '../schemas/transaction'
import { getFinancialOverviewSummary } from '../services/balances'
import { listFinancialOverview } from '../services/financial'
import { findUserById } from '../services/users'

export const getFinancial: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/financial/overview',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Financial'],
        security: [{ bearerAuth: [] }],
        summary:
          'Obtém uma visão geral financeira do usuário autenticado, incluindo contas, categorias e transações.',
        querystring: listTransactionsSchema,
        response: {
          200: listFinancialOverviewResponseSchema,
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

        const transactions = await listFinancialOverview({
          ...query,
          userId,
        })

        return reply.send(transactions)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}

export const getFinancialSummary: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/financial/summary',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Financial'],
        security: [{ bearerAuth: [] }],
        summary: 'Obtém um resumo financeiro do usuário autenticado.',
        response: {
          200: z.object({
            totalBalance: z.number(),
            monthIncome: z.number(),
            monthExpense: z.number(),
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

        const transactions = await getFinancialOverviewSummary(userId)

        return reply.send(transactions)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}
