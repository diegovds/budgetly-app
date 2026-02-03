import { FastifyInstance } from 'fastify'
import { createAccount, getAccounts } from '../controllers/accounts'
import { createCategory } from '../controllers/categories'
import { getFinancial, getFinancialSummary } from '../controllers/financial'
import { main } from '../controllers/main'
import {
  createTransaction,
  dropTransaction,
  getTransactions,
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
  app.register(getTransactions)
  app.register(getFinancial)
  app.register(getFinancialSummary)
  app.register(getAccounts)
}
