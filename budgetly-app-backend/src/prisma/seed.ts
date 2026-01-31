import bcrypt from 'bcrypt'
import { AccountType, TransactionType } from '../lib/generated/prisma/enums'
import { prisma } from '../lib/prisma'

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function randomDateInLastYear() {
  const now = new Date()
  const past = new Date()
  past.setFullYear(now.getFullYear() - 1)

  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  )
}

async function main() {
  // 🧑 User
  const passwordHash = await bcrypt.hash('123456', 10)

  const user = await prisma.user.create({
    data: {
      name: 'Diego Viana',
      email: 'diego@email.com',
      password: passwordHash,
    },
  })

  // 🏦 Accounts
  const accounts = await prisma.account.createMany({
    data: [
      {
        name: 'Checking Account',
        type: AccountType.CHECKING,
        balance: 5000,
        userId: user.id,
      },
      {
        name: 'Credit Card',
        type: AccountType.CREDIT,
        balance: -1200,
        userId: user.id,
      },
      {
        name: 'Cash',
        type: AccountType.CASH,
        balance: 800,
        userId: user.id,
      },
    ],
  })

  const userAccounts = await prisma.account.findMany({
    where: { userId: user.id },
  })

  // 🗂 Categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Salary', type: TransactionType.INCOME, userId: user.id },
      { name: 'Freelance', type: TransactionType.INCOME, userId: user.id },
      { name: 'Food', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Rent', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Transport', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Entertainment', type: TransactionType.EXPENSE, userId: user.id },
    ],
  })

  const userCategories = await prisma.category.findMany({
    where: { userId: user.id },
  })

  // 💸 Transactions (últimos 12 meses)
  const transactions = []

  for (let i = 0; i < 120; i++) {
    const category =
      userCategories[Math.floor(Math.random() * userCategories.length)]
    const account =
      userAccounts[Math.floor(Math.random() * userAccounts.length)]

    const amount =
      category.type === TransactionType.INCOME
        ? randomBetween(1500, 6000)
        : randomBetween(20, 500)

    transactions.push({
      amount: Number(amount.toFixed(2)),
      description:
        category.type === TransactionType.INCOME
          ? 'Income transaction'
          : 'Expense transaction',
      date: randomDateInLastYear(),
      type: category.type,
      userId: user.id,
      accountId: account.id,
      categoryId: category.id,
    })
  }

  await prisma.transaction.createMany({
    data: transactions,
  })

  console.log('✅ Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
