import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { categorySchema } from '../schemas/category'
import { insertCategory } from '../services/category'
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
          type: z.enum(['INCOME', 'EXPENSE']),
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
