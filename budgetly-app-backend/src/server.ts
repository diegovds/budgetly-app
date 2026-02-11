import { app } from './app'
import { env } from './env'

// Start do servidor
app.listen({ port: env.PORT }).then(() => {
  console.log(`🚀 HTTP Server Running! http://localhost:${env.PORT}`)
})
