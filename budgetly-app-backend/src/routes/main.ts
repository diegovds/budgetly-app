import { FastifyInstance } from 'fastify'
import { createAccount } from '../controllers/accounts'
import { createCategory } from '../controllers/category'
import { main } from '../controllers/main'
import { auth, getUser } from '../controllers/users'

export async function routes(app: FastifyInstance) {
  app.register(main)
  app.register(auth)
  app.register(getUser)
  app.register(createAccount)
  app.register(createCategory)
}
