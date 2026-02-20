import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { attachDatabasePool } from '@vercel/functions'
import { Pool } from 'pg'
import { env } from '../env'

const pool = new Pool({ connectionString: env.DATABASE_URL })

attachDatabasePool(pool)

export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
})
