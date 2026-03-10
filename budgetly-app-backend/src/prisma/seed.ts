import { AccountType, TransactionType } from '@prisma/client'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'

// ---------- helpers ----------
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomBetween(min: number, max: number) {
  return Number((Math.random() * (max - min) + min).toFixed(2))
}

function randomTime(startHour: number, endHour: number) {
  const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour
  const minute = Math.floor(Math.random() * 60)
  return { hour, minute }
}

function dateInMonthWithTime(
  year: number,
  month: number,
  day: number,
  startHour = 8,
  endHour = 18,
) {
  const now = new Date()

  // Se for mês atual, não permite dias futuros
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  const maxDay = isCurrentMonth ? now.getDate() : day

  const safeDay = Math.min(day, maxDay)

  const { hour, minute } = randomTime(startHour, endHour)

  const date = new Date(year, month, safeDay, hour, minute)

  // Garantia extra: nunca maior que agora
  return date > now ? now : date
}

// ---------- seed ----------
async function main() {
  console.log('🌱 Iniciando seed...')

  // 🧑 Usuário
  const passwordHash = await bcrypt.hash('123456', 10)
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@email.com',
      password: passwordHash,
    },
  })

  // 🏦 Contas
  const checking = await prisma.account.create({
    data: {
      name: 'Orion Financial',
      type: AccountType.CHECKING,
      userId: user.id,
    },
  })

  const credit = await prisma.account.create({
    data: {
      name: 'Nebula Credit',
      type: AccountType.CREDIT,
      userId: user.id,
    },
  })

  const cash = await prisma.account.create({
    data: {
      name: 'Vertex Bank',
      type: AccountType.CASH,
      userId: user.id,
    },
  })

  const saving = await prisma.account.create({
    data: {
      name: 'Atlas Bank',
      type: AccountType.SAVING,
      userId: user.id,
    },
  })

  await prisma.account.create({
    data: {
      name: 'Lumix Bank',
      type: AccountType.CHECKING,
      userId: user.id,
    },
  })

  // 🗂 Categorias
  await prisma.category.createMany({
    data: [
      { name: 'Salário', type: TransactionType.INCOME, userId: user.id },
      { name: 'Freelance', type: TransactionType.INCOME, userId: user.id },
      { name: 'Vendas', type: TransactionType.INCOME, userId: user.id },

      { name: 'Aluguel', type: TransactionType.EXPENSE, userId: user.id },
      {
        name: 'Energia Elétrica',
        type: TransactionType.EXPENSE,
        userId: user.id,
      },
      {
        name: 'Água',
        type: TransactionType.EXPENSE,
        userId: user.id,
      },
      {
        name: 'Telefone',
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

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
  })

  const byName = (name: string) => categories.find((c) => c.name === name)!

  // 📆 Últimos 12 meses
  const now = new Date()
  const transactions: any[] = []

  for (let i = 0; i < 12; i++) {
    const baseDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = baseDate.getFullYear()
    const month = baseDate.getMonth()

    // 💰 Salário (manhã)
    transactions.push({
      amount: 4800,
      description: 'Salário mensal',
      date: dateInMonthWithTime(year, month, 5, 8, 10),
      type: TransactionType.INCOME,
      userId: user.id,
      accountId: checking.id,
      categoryId: byName('Salário').id,
    })

    // 💻 Freelance (tarde)
    transactions.push({
      amount: randomBetween(1200, 3000),
      description: 'Projeto freelance',
      date: dateInMonthWithTime(year, month, 7, 14, 18),
      type: TransactionType.INCOME,
      userId: user.id,
      accountId: cash.id,
      categoryId: byName('Freelance').id,
    })

    for (let i = 0; i < 20; i++) {
      transactions.push({
        amount: randomBetween(20, 100),
        description: 'Venda de Produto',
        date: dateInMonthWithTime(year, month, 7, 14, 18),
        type: TransactionType.INCOME,
        userId: user.id,
        accountId: saving.id,
        categoryId: byName('Vendas').id,
      })
    }

    // 🏠 Contas fixas
    transactions.push(
      {
        amount: 1200,
        description: 'Aluguel do apartamento',
        date: dateInMonthWithTime(year, month, 8, 9, 11),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Aluguel').id,
      },
      {
        amount: randomBetween(120, 180),
        description: 'Conta de energia elétrica',
        date: dateInMonthWithTime(year, month, 10, 10, 15),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Energia Elétrica').id,
      },
      {
        amount: randomBetween(100, 120),
        description: 'Conta de água',
        date: dateInMonthWithTime(year, month, 10, 10, 15),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Água').id,
      },
      {
        amount: randomBetween(80, 100),
        description: 'Conta de telefone',
        date: dateInMonthWithTime(year, month, 10, 10, 15),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Telefone').id,
      },
      {
        amount: 110,
        description: 'Plano de internet residencial',
        date: dateInMonthWithTime(year, month, 12, 9, 12),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Internet').id,
      },
    )

    // 🍔 Alimentação e transporte
    transactions.push(
      {
        amount: randomBetween(220, 380),
        description: 'Compras de supermercado',
        date: dateInMonthWithTime(year, month, 15, 11, 14),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Alimentação').id,
      },
      {
        amount: randomBetween(80, 160),
        description: 'Abastecimento de veículo',
        date: dateInMonthWithTime(year, month, 18, 16, 19),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: saving.id,
        categoryId: byName('Transporte').id,
      },
    )

    // 🎮 Lazer (noite)
    const leisureDescriptions = [
      'Cinema com amigos',
      'Jantar em restaurante',
      'Assinatura de streaming',
      'Bar no final de semana',
      'Show local',
    ]

    transactions.push({
      amount: randomBetween(60, 200),
      description: randomItem(leisureDescriptions),
      date: dateInMonthWithTime(year, month, 22, 19, 23),
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
        date: dateInMonthWithTime(year, month, 25, 15, 21),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: credit.id,
        categoryId: byName('Compras').id,
      })
    }

    // ✈️ Viagem (2x por ano)
    if (month === 6 || month === 11) {
      transactions.push({
        amount: randomBetween(1200, 2800),
        description: 'Viagem de lazer',
        date: dateInMonthWithTime(year, month, 20, 6, 22),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: credit.id,
        categoryId: byName('Viagem').id,
      })
    }
  }

  await prisma.transaction.createMany({
    data: transactions,
  })

  console.log('✅ Seed concluído com sucesso')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
