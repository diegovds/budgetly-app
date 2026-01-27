import { FastifyInstance } from 'fastify'
import { auth, getUser } from '../controllers/users'
import { env } from '../env'

export async function routes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    reply.send({
      Budgetly_API: `Go to ${env.BASE_URL}/docs to see the documentation.`,
    })
  })

  app.register(auth)
  app.register(getUser)
}
