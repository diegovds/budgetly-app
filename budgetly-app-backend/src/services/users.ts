import { Prisma } from '../lib/generated/prisma/client'
import { prisma } from '../lib/prisma'

export async function insertUser({
  email,
  name,
  password,
}: Prisma.UserCreateInput) {
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password,
    },
  })

  return newUser
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  })
}
