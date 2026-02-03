import bcrypt from 'bcrypt'
import { AccountType, TransactionType } from '../lib/generated/prisma/enums'
import { prisma } from '../lib/prisma'

// ---------- helpers ----------
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomBetween(min: number, max: number) {
  return Number((Math.random() * (max - min) + min).toFixed(2))
}

function dateInMonth(year: number, month: number, day = 5) {
  return new Date(year, month, day)
}

// ---------- seed ----------
async function main() {
  console.log('🌱 Iniciando seed...')

  // 🧑 Usuário
  const passwordHash = await bcrypt.hash('123456', 10)
  const user = await prisma.user.create({
    data: {
      name: 'Diego Viana',
      email: 'diego@email.com',
      password: passwordHash,
    },
  })

  // 🏦 Contas
  const checking = await prisma.account.create({
    data: {
      name: 'Conta Corrente',
      type: AccountType.CHECKING,
      userId: user.id,
    },
  })

  const credit = await prisma.account.create({
    data: {
      name: 'Cartão de Crédito',
      type: AccountType.CREDIT,
      userId: user.id,
    },
  })

  const cash = await prisma.account.create({
    data: {
      name: 'Dinheiro',
      type: AccountType.CASH,
      userId: user.id,
    },
  })

  // 🗂 Categorias
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Salário', type: TransactionType.INCOME, userId: user.id },
      { name: 'Freelance', type: TransactionType.INCOME, userId: user.id },

      { name: 'Aluguel', type: TransactionType.EXPENSE, userId: user.id },
      {
        name: 'Energia Elétrica',
        type: TransactionType.EXPENSE,
        userId: user.id,
      },
      { name: 'Internet', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Alimentação', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Transporte', type: TransactionType.EXPENSE, userId: user.id },

      { name: 'Lazer', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Compras', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Viagem', type: TransactionType.EXPENSE, userId: user.id },
    ],
  })

  const allCategories = await prisma.category.findMany({
    where: { userId: user.id },
  })

  const byName = (name: string) => allCategories.find((c) => c.name === name)!

  // 📆 Últimos 12 meses
  const now = new Date()
  const transactions = []

  for (let i = 0; i < 12; i++) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = month.getFullYear()
    const monthIndex = month.getMonth()

    // 💰 Salário fixo
    transactions.push({
      amount: 4800,
      description: 'Salário mensal',
      date: dateInMonth(year, monthIndex, 5),
      type: TransactionType.INCOME,
      userId: user.id,
      accountId: checking.id,
      categoryId: byName('Salário').id,
    })

    // Freelance ocasional
    transactions.push({
      amount: Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000,
      description: 'Freelance ocasional',
      date: dateInMonth(year, monthIndex, 5),
      type: TransactionType.INCOME,
      userId: user.id,
      accountId: cash.id,
      categoryId: byName('Freelance').id,
    })

    // 🏠 Contas fixas
    transactions.push(
      {
        amount: 1200,
        description: 'Aluguel do apartamento',
        date: dateInMonth(year, monthIndex, 8),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Aluguel').id,
      },
      {
        amount: randomBetween(120, 180),
        description: 'Conta de energia elétrica',
        date: dateInMonth(year, monthIndex, 10),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Energia Elétrica').id,
      },
      {
        amount: 110,
        description: 'Plano de internet residencial',
        date: dateInMonth(year, monthIndex, 12),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Internet').id,
      },
    )

    // 🍔 Alimentação e transporte
    transactions.push(
      {
        amount: randomBetween(200, 350),
        description: 'Compras de supermercado',
        date: dateInMonth(year, monthIndex, 15),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Alimentação').id,
      },
      {
        amount: randomBetween(80, 150),
        description: 'Combustível',
        date: dateInMonth(year, monthIndex, 18),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Transporte').id,
      },
    )

    // 🎮 Lazer criativo (variável)
    const leisureDescriptions = [
      'Cinema com amigos',
      'Jantar em restaurante',
      'Assinatura de streaming',
      'Bar no final de semana',
      'Show local',
    ]

    transactions.push({
      amount: randomBetween(60, 180),
      description: randomItem(leisureDescriptions),
      date: dateInMonth(year, monthIndex, 22),
      type: TransactionType.EXPENSE,
      userId: user.id,
      accountId: credit.id,
      categoryId: byName('Lazer').id,
    })

    // 🛒 Compras esporádicas
    if (Math.random() > 0.5) {
      transactions.push({
        amount: randomBetween(200, 900),
        description: randomItem([
          'Compra de roupas',
          'Teclado mecânico',
          'Fone de ouvido',
          'Mochila nova',
          'Cadeira de escritório',
        ]),
        date: dateInMonth(year, monthIndex, 25),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: credit.id,
        categoryId: byName('Compras').id,
      })
    }

    // ✈️ Viagem ocasional
    if (monthIndex === 6 || monthIndex === 11) {
      transactions.push({
        amount: randomBetween(1200, 2800),
        description: 'Viagem de lazer',
        date: dateInMonth(year, monthIndex, 20),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: credit.id,
        categoryId: byName('Viagem').id,
      })
    }
  }

  await prisma.transaction.createMany({ data: transactions })

  console.log('✅ Seed concluído com sucesso')
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect())
