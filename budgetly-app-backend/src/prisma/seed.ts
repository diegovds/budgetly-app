import { AccountType, TransactionType } from '@prisma/client'
import bcrypt from 'bcrypt'
import removeAccents from 'remove-accents'
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

  // Padrão de meses: alterna entre bons e ruins para renda não ser crescente
  const monthProfiles: Array<'good' | 'average' | 'bad'> = [
    'average',
    'bad',
    'good',
    'average',
    'bad',
    'good',
    'bad',
    'average',
    'good',
    'bad',
    'average',
    'good',
  ]

  for (let i = 0; i < 12; i++) {
    const baseDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = baseDate.getFullYear()
    const month = baseDate.getMonth()
    const profile = monthProfiles[i % monthProfiles.length]

    // 💰 Salário (manhã) — varia levemente, com bônus esporádico
    const baseSalary =
      profile === 'good' ? 5200 : profile === 'bad' ? 4200 : 4800
    const salaryBonus =
      profile === 'good' && Math.random() > 0.6 ? randomBetween(500, 1500) : 0
    transactions.push({
      amount: baseSalary + salaryBonus,
      description:
        salaryBonus > 0 ? 'Salário mensal + bônus' : 'Salário mensal',
      date: dateInMonthWithTime(year, month, 5, 8, 10),
      type: TransactionType.INCOME,
      userId: user.id,
      accountId: checking.id,
      categoryId: byName('Salário').id,
    })

    // 💻 Freelance (tarde) — nem todo mês tem freelance
    const hasFreelance =
      profile === 'good'
        ? Math.random() > 0.2
        : profile === 'bad'
          ? Math.random() > 0.7
          : Math.random() > 0.4
    if (hasFreelance) {
      const freelanceAmount =
        profile === 'good'
          ? randomBetween(2000, 3500)
          : profile === 'bad'
            ? randomBetween(500, 1200)
            : randomBetween(1200, 2500)
      transactions.push({
        amount: freelanceAmount,
        description: 'Projeto freelance',
        date: dateInMonthWithTime(year, month, 7, 14, 18),
        type: TransactionType.INCOME,
        userId: user.id,
        accountId: cash.id,
        categoryId: byName('Freelance').id,
      })
    }

    // 🛍 Vendas — quantidade e valor variam com o perfil do mês
    const salesCount =
      profile === 'good'
        ? randomBetween(15, 25)
        : profile === 'bad'
          ? randomBetween(3, 10)
          : randomBetween(8, 18)
    for (let j = 0; j < Math.round(salesCount); j++) {
      const saleAmount =
        profile === 'good'
          ? randomBetween(30, 120)
          : profile === 'bad'
            ? randomBetween(10, 60)
            : randomBetween(20, 100)
      transactions.push({
        amount: saleAmount,
        description: 'Venda de Produto',
        date: dateInMonthWithTime(year, month, randomBetween(1, 28), 8, 20),
        type: TransactionType.INCOME,
        userId: user.id,
        accountId: saving.id,
        categoryId: byName('Vendas').id,
      })
    }

    // 🏠 Contas fixas (cada uma em um dia diferente, como na vida real)
    transactions.push(
      {
        amount: 1200,
        description: 'Aluguel do apartamento',
        date: dateInMonthWithTime(year, month, 5, 9, 11),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Aluguel').id,
      },
      {
        // Energia varia com estação: meses quentes (nov-mar) gastam mais AC
        amount:
          month >= 10 || month <= 2
            ? randomBetween(180, 280)
            : randomBetween(100, 160),
        description: 'Conta de energia elétrica',
        date: dateInMonthWithTime(year, month, 12, 10, 15),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Energia Elétrica').id,
      },
      {
        amount: randomBetween(80, 130),
        description: 'Conta de água',
        date: dateInMonthWithTime(year, month, 15, 10, 15),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Água').id,
      },
      {
        amount: 69.9,
        description: 'Plano de celular',
        date: dateInMonthWithTime(year, month, 8, 8, 10),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Telefone').id,
      },
      {
        amount: 119.9,
        description: 'Plano de internet residencial',
        date: dateInMonthWithTime(year, month, 20, 9, 12),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Internet').id,
      },
    )

    // 🍔 Alimentação — várias transações espalhadas pelo mês
    const foodItems: Array<{
      desc: string
      min: number
      max: number
      startH: number
      endH: number
      account: string
    }> = [
      {
        desc: 'Supermercado',
        min: 150,
        max: 350,
        startH: 10,
        endH: 14,
        account: 'checking',
      },
      {
        desc: 'Supermercado',
        min: 80,
        max: 200,
        startH: 10,
        endH: 14,
        account: 'checking',
      },
      {
        desc: 'Feira da semana',
        min: 40,
        max: 90,
        startH: 7,
        endH: 10,
        account: 'cash',
      },
      { desc: 'Padaria', min: 8, max: 25, startH: 7, endH: 9, account: 'cash' },
      { desc: 'Padaria', min: 8, max: 25, startH: 7, endH: 9, account: 'cash' },
      {
        desc: 'Delivery iFood',
        min: 25,
        max: 65,
        startH: 19,
        endH: 22,
        account: 'credit',
      },
      {
        desc: 'Delivery iFood',
        min: 25,
        max: 65,
        startH: 19,
        endH: 22,
        account: 'credit',
      },
      {
        desc: 'Delivery iFood',
        min: 25,
        max: 65,
        startH: 19,
        endH: 22,
        account: 'credit',
      },
      {
        desc: 'Almoço restaurante',
        min: 30,
        max: 55,
        startH: 11,
        endH: 14,
        account: 'credit',
      },
      {
        desc: 'Almoço restaurante',
        min: 30,
        max: 55,
        startH: 11,
        endH: 14,
        account: 'credit',
      },
      {
        desc: 'Café e lanche',
        min: 10,
        max: 30,
        startH: 14,
        endH: 17,
        account: 'cash',
      },
    ]
    const accountMap: Record<string, string> = {
      checking: checking.id,
      credit: credit.id,
      cash: cash.id,
      saving: saving.id,
    }
    // Mês ruim come mais em casa (menos delivery/restaurante), mês bom gasta mais
    const foodCount =
      profile === 'good'
        ? randomBetween(8, 11)
        : profile === 'bad'
          ? randomBetween(5, 7)
          : randomBetween(6, 9)
    const selectedFoods = Array.from({ length: Math.round(foodCount) }, () =>
      randomItem(foodItems),
    )
    for (const food of selectedFoods) {
      transactions.push({
        amount: randomBetween(food.min, food.max),
        description: food.desc,
        date: dateInMonthWithTime(
          year,
          month,
          Math.floor(randomBetween(1, 28)),
          food.startH,
          food.endH,
        ),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: accountMap[food.account],
        categoryId: byName('Alimentação').id,
      })
    }

    // 🚗 Transporte — abastecimento, uber, estacionamento
    // Abastecimento 1-2x por mês
    const fuelCount = Math.random() > 0.5 ? 2 : 1
    for (let j = 0; j < fuelCount; j++) {
      transactions.push({
        amount: randomBetween(150, 280),
        description: 'Abastecimento de veículo',
        date: dateInMonthWithTime(
          year,
          month,
          Math.floor(randomBetween(j === 0 ? 3 : 16, j === 0 ? 15 : 28)),
          15,
          19,
        ),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: checking.id,
        categoryId: byName('Transporte').id,
      })
    }
    // Uber/99 esporádico
    const uberCount = Math.floor(randomBetween(1, 5))
    for (let j = 0; j < uberCount; j++) {
      transactions.push({
        amount: randomBetween(12, 45),
        description: randomItem(['Uber', '99 Táxi', 'Uber']),
        date: dateInMonthWithTime(
          year,
          month,
          Math.floor(randomBetween(1, 28)),
          7,
          23,
        ),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: credit.id,
        categoryId: byName('Transporte').id,
      })
    }
    // Estacionamento ocasional
    if (Math.random() > 0.4) {
      transactions.push({
        amount: randomBetween(8, 25),
        description: 'Estacionamento',
        date: dateInMonthWithTime(
          year,
          month,
          Math.floor(randomBetween(1, 28)),
          10,
          20,
        ),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: cash.id,
        categoryId: byName('Transporte').id,
      })
    }

    // 🎮 Lazer — várias atividades pelo mês
    const leisureOptions = [
      { desc: 'Cinema', min: 30, max: 60 },
      { desc: 'Jantar fora com amigos', min: 80, max: 180 },
      { desc: 'Assinatura streaming', min: 25, max: 55 },
      { desc: 'Bar no final de semana', min: 40, max: 120 },
      { desc: 'Show / evento', min: 80, max: 250 },
      { desc: 'Jogo online / skin', min: 15, max: 50 },
      { desc: 'Parque / passeio', min: 20, max: 60 },
    ]
    const leisureCount =
      profile === 'good'
        ? Math.floor(randomBetween(3, 6))
        : profile === 'bad'
          ? Math.floor(randomBetween(1, 3))
          : Math.floor(randomBetween(2, 4))
    for (let j = 0; j < leisureCount; j++) {
      const leisure = randomItem(leisureOptions)
      transactions.push({
        amount: randomBetween(leisure.min, leisure.max),
        description: leisure.desc,
        date: dateInMonthWithTime(
          year,
          month,
          Math.floor(randomBetween(1, 28)),
          17,
          23,
        ),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: credit.id,
        categoryId: byName('Lazer').id,
      })
    }

    // 🛒 Compras esporádicas — mais chance em mês bom, menos em ruim
    const buyChance = profile === 'good' ? 0.7 : profile === 'bad' ? 0.2 : 0.45
    if (Math.random() < buyChance) {
      const purchaseCount = Math.random() > 0.7 ? 2 : 1
      for (let j = 0; j < purchaseCount; j++) {
        transactions.push({
          amount: randomBetween(80, 700),
          description: randomItem([
            'Compra de roupas',
            'Teclado mecânico',
            'Fone de ouvido',
            'Mochila nova',
            'Cadeira de escritório',
            'Tênis esportivo',
            'Livro',
            'Produto de beleza',
            'Utensílio doméstico',
          ]),
          date: dateInMonthWithTime(
            year,
            month,
            Math.floor(randomBetween(10, 28)),
            12,
            21,
          ),
          type: TransactionType.EXPENSE,
          userId: user.id,
          accountId: credit.id,
          categoryId: byName('Compras').id,
        })
      }
    }

    // ✈️ Viagem (2x por ano)
    if (month === 6 || month === 11) {
      transactions.push({
        amount: randomBetween(1200, 2800),
        description: randomItem([
          'Passagem aérea',
          'Hotel / hospedagem',
          'Viagem de lazer',
        ]),
        date: dateInMonthWithTime(year, month, 20, 6, 22),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: credit.id,
        categoryId: byName('Viagem').id,
      })
    }
  }

  const transactionsWithNormalized = transactions.map((t) => ({
    ...t,
    descriptionNormalized: t.description ? removeAccents(t.description) : null,
  }))

  await prisma.transaction.createMany({
    data: transactionsWithNormalized,
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
