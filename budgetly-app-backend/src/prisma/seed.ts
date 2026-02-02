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
  // 🔐 Usuário
  const passwordHash = await bcrypt.hash('123456', 10)

  const user = await prisma.user.create({
    data: {
      name: 'Diego Viana',
      email: 'diego@email.com',
      password: passwordHash,
    },
  })

  // 🏦 Contas (saldo inicia em 0)
  await prisma.account.createMany({
    data: [
      {
        name: 'Conta Corrente',
        type: AccountType.CHECKING,
        userId: user.id,
      },
      {
        name: 'Cartão de Crédito',
        type: AccountType.CREDIT,
        userId: user.id,
      },
      {
        name: 'Carteira',
        type: AccountType.CASH,
        userId: user.id,
      },
    ],
  })

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
  })

  // 🗂 Categorias
  await prisma.category.createMany({
    data: [
      { name: 'Salário', type: TransactionType.INCOME, userId: user.id },
      { name: 'Freelance', type: TransactionType.INCOME, userId: user.id },
      { name: 'Alimentação', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Aluguel', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Transporte', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Lazer', type: TransactionType.EXPENSE, userId: user.id },
    ],
  })

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
  })

  // 💸 Transações (12 meses)
  const transactions: any[] = []

  for (let i = 0; i < 150; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const account = accounts[Math.floor(Math.random() * accounts.length)]

    const isIncome = category.type === TransactionType.INCOME

    const amount = isIncome ? randomBetween(2500, 6000) : randomBetween(20, 600)

    transactions.push({
      amount: Number(amount.toFixed(2)),
      description: isIncome
        ? category.name === 'Salário'
          ? 'Salário mensal'
          : 'Pagamento de freelance'
        : category.name === 'Alimentação'
          ? 'Compra em supermercado'
          : category.name === 'Aluguel'
            ? 'Pagamento do aluguel'
            : category.name === 'Transporte'
              ? 'Uber / combustível'
              : 'Lazer e entretenimento',
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

  console.log('✅ Seed financeiro criado com sucesso')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
