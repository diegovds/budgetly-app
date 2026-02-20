import { Prisma } from '@prisma/client'
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

export async function findUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      accounts: true,
      categories: true,
      transactions: true,
    },
  })
}
