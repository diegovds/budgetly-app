import { FastifyInstance } from 'fastify'
import { createAccount } from '../controllers/accounts'
import { createCategory } from '../controllers/categories'
import { main } from '../controllers/main'
import {
  createTransaction,
  dropTransaction,
  updateTransaction_,
} from '../controllers/transactions'
import { auth, getUser } from '../controllers/users'

export async function routes(app: FastifyInstance) {
  app.register(main)
  app.register(auth)
  app.register(getUser)
  app.register(createAccount)
  app.register(createCategory)
  app.register(createTransaction)
  app.register(dropTransaction)
  app.register(updateTransaction_)
}
