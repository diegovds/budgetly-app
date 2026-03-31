import { FastifyInstance } from 'fastify'
import {
  createAccount,
  dropAccount,
  getAccounts,
  getAccountTypes,
  updateAccount_,
} from '../controllers/accounts'
import {
  createCategory,
  dropCategory,
  getCategoryTypes,
  listCategories,
  updateCategory_,
} from '../controllers/categories'
import {
  getBalanceLastMonths,
  getLastMonthsIncomeExpense,
  getListCategories,
  getTopExpense,
} from '../controllers/dashboard'
import { getFinancial, getFinancialSummary } from '../controllers/financial'
import { main } from '../controllers/main'
import {
  createTransaction,
  dropTransaction,
  getTransactions,
  listTransactionsSummary,
  updateTransaction_,
} from '../controllers/transactions'
import {
  auth,
  changePassword,
  getUser,
  getUserStatsController,
} from '../controllers/users'

export async function routes(app: FastifyInstance) {
  app.register(main)
  app.register(auth)
  app.register(getUser)
  app.register(changePassword)
  app.register(getUserStatsController)
  app.register(createAccount)
  app.register(createCategory)
  app.register(createTransaction)
  app.register(dropTransaction)
  app.register(updateTransaction_)
  app.register(dropAccount)
  app.register(updateAccount_)
  app.register(dropCategory)
  app.register(updateCategory_)
  app.register(getTransactions)
  app.register(getFinancial)
  app.register(getFinancialSummary)
  app.register(getAccounts)
  app.register(listCategories)
  app.register(listTransactionsSummary)
  app.register(getAccountTypes)
  app.register(getCategoryTypes)
  app.register(getBalanceLastMonths)
  app.register(getLastMonthsIncomeExpense)
  app.register(getTopExpense)
  app.register(getListCategories)
}
