import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { mapUserForResponse } from '../mappers/user'
import { accountSchema } from '../schemas/account'
import { categorySchema } from '../schemas/category'
import { transactionSchema } from '../schemas/transaction'
import { findUserByEmail, findUserById, insertUser } from '../services/users'

export const auth: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/auth',
    {
      schema: {
        tags: ['User'],
        security: [],
        summary: 'Cria uma nova conta ou autentica um usuário existente',
        description:
          'Se o usuário não existir, uma nova conta será criada. Se o usuário já existir, ele será autenticado.',
        body: z.object({
          name: z
            .string()
            .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
            .optional(),
          email: z.email({ message: 'E-mail não válido' }),
          password: z
            .string()
            .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      let passwordVerify = false
      let passwordHash = ''

      let user = await findUserByEmail(email)

      if (user && name) {
        return reply.status(400).send({
          message: 'Email já cadastrado',
        })
      }

      if (user) {
        passwordVerify = await app.bcrypt.compare(password, user.password)

        if (!passwordVerify) {
          return reply.status(401).send({
            message: 'Verifique as credenciais.',
          })
        }
      }

      if (!user && name) {
        passwordHash = await app.bcrypt.hash(password)

        user = await insertUser({
          name,
          email,
          password: passwordHash,
        })
      }

      if ((passwordVerify || passwordHash.length > 0) && user) {
        const token = app.jwt.sign(
          {
            name: user.name,
          },
          {
            sub: user.id,
            expiresIn: '30 days',
          },
        )

        return reply.status(200).send({ token })
      }

      if (!user) {
        return reply.status(404).send({
          message: 'Usuário não cadastrado.',
        })
      }

      return reply.status(400).send({ message: 'Ocorreu um erro no servidor.' })
    },
  )
}

export const getUser: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/user',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        summary: 'Retorna os dados do usuário autenticado',
        response: {
          200: z.object({
            name: z.string(),
            accounts: z.array(accountSchema),
            categories: z.array(categorySchema),
            transactions: z.array(transactionSchema),
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

        if (!user) {
          return reply.status(404).send({ message: 'Usuário não encontrado.' })
        }

        const mappedUser = await mapUserForResponse(user)
        return reply.send(mappedUser)
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: 'Erro interno do servidor.' })
      }
    },
  )
}
