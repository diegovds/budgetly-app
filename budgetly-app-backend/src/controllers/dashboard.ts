import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getLast12MonthsAccumulatedBalance } from '../services/dashboard'
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
