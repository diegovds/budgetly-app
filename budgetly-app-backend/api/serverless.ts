import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import fastifyBcrypt from 'fastify-bcrypt'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from '../src/env'
import { routes } from '../src/routes/main'

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

// Rotas
app.register(routes)

// Start do servidor
export default async (req: any, res: any) => {
  await app.ready()
  app.server.emit('request', req, res)
}
