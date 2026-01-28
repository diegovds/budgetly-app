import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { transactionSchema } from '../schemas/transaction'
import { insertTransaction } from '../services/transactions'
import { findUserById } from '../services/users'

export const createTransaction: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/transaction',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Transaction'],
        security: [{ bearerAuth: [] }],
        summary: 'Cria uma nova transação para o usuário autenticado.',
        body: z.object({
          amount: z.number(),
          description: z.string().nullable(),
          date: z.iso.datetime(),
          type: z.enum(['INCOME', 'EXPENSE']),
          accountId: z.uuid(),
          categoryId: z.uuid(),
        }),
        response: {
          200: transactionSchema,
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

        const { accountId, amount, categoryId, date, description, type } =
          request.body

        const newTransaction = await insertTransaction({
          accountId,
          amount,
          categoryId,
          date,
          description,
          type,
          userId,
        })

        return reply.send(newTransaction)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}
