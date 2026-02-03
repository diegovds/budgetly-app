import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { accountSchema } from '../schemas/account'
import { getAccountsByUserId, insertAccount } from '../services/accounts'
import { findUserById } from '../services/users'

export const createAccount: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/account',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Account'],
        security: [{ bearerAuth: [] }],
        summary: 'Cria uma nova conta para o usuário autenticado',
        body: z.object({
          name: z
            .string()
            .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
          type: z.enum(['CHECKING', 'CREDIT', 'CASH']),
        }),
        response: {
          200: accountSchema,
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

        const newAccount = await insertAccount({
          name,
          type,
          userId,
        })

        return reply.send(newAccount)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}

export const getAccounts: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/account',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Account'],
        security: [{ bearerAuth: [] }],
        summary: 'Obtém todas as contas do usuário autenticado',
        response: {
          200: z.array(
            z.object({
              id: z.uuid(),
              name: z.string(),
              balance: z.number(),
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

        const accounts = await getAccountsByUserId(userId)

        return reply.send(accounts)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}
