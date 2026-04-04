import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySensible from '@fastify/sensible'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import type { FastifyError } from 'fastify'
import fastifyBcrypt from 'fastify-bcrypt'
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { routes } from './routes/main'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>
  }
}

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler((error: FastifyError, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    const message = error.validation[0]?.message ?? 'Dados inválidos.'
    return reply.status(400).send({ message })
  }

  const status = error.statusCode ?? 500
  const message = error.message ?? 'Erro interno do servidor.'
  return reply.status(status).send({ message })
})

// CORS
app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

// Bcrypt
app.register(fastifyBcrypt, {
  saltWorkFactor: 10,
})

// JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET_KEY,
})

app.decorate('authenticate', async function (request, reply): Promise<void> {
  try {
    await request.jwtVerify()
  } catch {
    reply.status(401).send({ message: 'Não autorizado' })
  }
})

// Swagger
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Budgetly Backend',
      version: '0.0.1',
      description: 'API para o Budgetly',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  transform: jsonSchemaTransform,
})

// Swagger UI
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifySensible)

// Rotas
app.register(routes)

export { app }
