import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
  listTransactionsSchema,
  ListTransactionsSummaryResponseSchema,
  paginationMetaSchema,
  transactionSchema,
} from '../schemas/transaction'
import {
  deleteTransaction,
  getTransactionById,
  insertTransaction,
  listRecentTransactions,
  listTransactions,
  updateTransaction,
} from '../services/transactions'
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
        throw err
      }
    },
  )
}

export const dropTransaction: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/transaction/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Transaction'],
        security: [{ bearerAuth: [] }],
        summary: 'Exclui uma transação pelo ID para o usuário autenticado.',
        params: z.object({
          id: z.uuid(),
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
        const { id } = request.params
        const userId = request.user.sub
        const user = await findUserById(userId)

        if (!user) {
          return reply.status(404).send({ message: 'Usuário não encontrado.' })
        }

        const transaction = await getTransactionById(id)

        if (!transaction || transaction.userId !== userId) {
          return reply
            .status(404)
            .send({ message: 'Transação não encontrada.' })
        }

        const deletedTransaction = await deleteTransaction({
          id,
          transaction: {
            ...transaction,
            amount: Number(transaction.amount),
            date: transaction.date.toISOString(),
          },
        })

        return reply.send(deletedTransaction)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}

export const updateTransaction_: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/transaction/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Transaction'],
        security: [{ bearerAuth: [] }],
        summary: 'Atualiza uma transação pelo ID para o usuário autenticado.',
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          amount: z.number(),
          description: z.string().nullable(),
          date: z.iso.datetime(),
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
        const { id } = request.params
        const { amount, description, date } = request.body
        const userId = request.user.sub
        const user = await findUserById(userId)

        if (!user) {
          return reply.status(404).send({ message: 'Usuário não encontrado.' })
        }

        const transaction = await getTransactionById(id)

        if (!transaction || transaction.userId !== userId) {
          return reply
            .status(404)
            .send({ message: 'Transação não encontrada.' })
        }

        const updatedTransaction = await updateTransaction({
          id,
          amount,
          description,
          date,
          transaction: {
            ...transaction,
            amount: Number(transaction.amount),
            date: transaction.date.toISOString(),
          },
        })

        return reply.send(updatedTransaction)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}

export const getTransactions: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/transactions',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Transaction'],
        security: [{ bearerAuth: [] }],
        summary:
          'Lista as transações do usuário autenticado com filtros e paginação.',
        querystring: listTransactionsSchema,
        response: {
          200: z.object({
            transactions: z.array(transactionSchema),
            meta: paginationMetaSchema,
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
        const query = request.query

        if (!user) {
          return reply.status(404).send({ message: 'Usuário não encontrado.' })
        }

        const transactions = await listTransactions({
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

export const listTransactionsSummary: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/transactions/summary',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['Transaction'],
        security: [{ bearerAuth: [] }],
        summary:
          'Lista um resumo das transações recentes do usuário autenticado.',
        querystring: z.object({
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(100).default(3),
        }),
        response: {
          200: ListTransactionsSummaryResponseSchema,
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

        const transactions = await listRecentTransactions({
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
