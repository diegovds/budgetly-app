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

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDay(min = 1, max = 28) {
  return randomInt(min, max)
}

function randomTime(startHour: number, endHour: number) {
  const hour = randomInt(startHour, endHour)
  const minute = randomInt(0, 59)
  return { hour, minute }
}

function dateInMonth(
  year: number,
  month: number,
  day: number,
  startHour = 8,
  endHour = 18,
) {
  const now = new Date()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()
  const safeDay = Math.min(day, isCurrentMonth ? now.getDate() : day)
  const { hour, minute } = randomTime(startHour, endHour)
  const date = new Date(year, month, safeDay, hour, minute)
  return date > now ? now : date
}

// ---------- seed ----------
async function main() {
  console.log('🌱 Iniciando seed...')

  // ────────────── Usuário ──────────────
  const passwordHash = await bcrypt.hash('123456', 10)
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@email.com',
      password: passwordHash,
    },
  })

  // ────────────── Contas ──────────────
  const nubank = await prisma.account.create({
    data: {
      name: 'Nubank',
      type: AccountType.CHECKING,
      userId: user.id,
    },
  })

  const itau = await prisma.account.create({
    data: {
      name: 'Itaú',
      type: AccountType.CHECKING,
      userId: user.id,
    },
  })

  const nubankCredito = await prisma.account.create({
    data: {
      name: 'Nubank Crédito',
      type: AccountType.CREDIT,
      userId: user.id,
    },
  })

  const carteira = await prisma.account.create({
    data: {
      name: 'Carteira',
      type: AccountType.CASH,
      userId: user.id,
    },
  })

  const reserva = await prisma.account.create({
    data: {
      name: 'Nubank Reserva',
      type: AccountType.SAVING,
      userId: user.id,
    },
  })

  // ────────────── Categorias ──────────────
  await prisma.category.createMany({
    data: [
      // Renda
      { name: 'Salário', type: TransactionType.INCOME, userId: user.id },
      { name: 'Freelance', type: TransactionType.INCOME, userId: user.id },
      { name: 'Rendimentos', type: TransactionType.INCOME, userId: user.id },
      { name: 'Pix Recebido', type: TransactionType.INCOME, userId: user.id },

      // Despesas
      { name: 'Moradia', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Mercado', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Restaurante', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Transporte', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Saúde', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Educação', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Assinaturas', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Lazer', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Roupas', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Pet', type: TransactionType.EXPENSE, userId: user.id },
      {
        name: 'Contas de Casa',
        type: TransactionType.EXPENSE,
        userId: user.id,
      },
      { name: 'Compras', type: TransactionType.EXPENSE, userId: user.id },
      { name: 'Viagem', type: TransactionType.EXPENSE, userId: user.id },
      {
        name: 'Transferência',
        type: TransactionType.EXPENSE,
        userId: user.id,
      },
      {
        name: 'Depósito',
        type: TransactionType.INCOME,
        userId: user.id,
      },
    ],
  })

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
  })
  const cat = (name: string) => categories.find((c) => c.name === name)!

  // ────────────── Transações ──────────────
  const now = new Date()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tx: any[] = []

  const baseProfiles: Array<'good' | 'average' | 'bad'> = [
    'average',
    'bad',
    'good',
    'bad',
    'average',
    'good',
    'bad',
    'good',
    'average',
    'bad',
    'average',
    'good',
  ]

  for (let i = 0; i < 12; i++) {
    const base = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const y = base.getFullYear()
    const m = base.getMonth()
    // Meses de viagem (jul=6, dez=11) sempre 'good' para renda cobrir os gastos
    const p = m === 6 || m === 11 ? 'good' : baseProfiles[i]

    // ═══════════ RENDA ═══════════

    // Salário — fixo, cai dia 5 (perfil afeta só renda variável)
    const salario = 6500
    tx.push({
      amount: salario,
      description: 'Salário mensal',
      date: dateInMonth(y, m, 5, 8, 10),
      type: TransactionType.INCOME,
      userId: user.id,
      accountId: itau.id,
      categoryId: cat('Salário').id,
    })

    // Hora extra / bônus em meses bons
    if (p === 'good') {
      tx.push({
        amount: randomBetween(600, 1500),
        description: randomItem(['Hora extra', 'Bônus desempenho', 'PLR']),
        date: dateInMonth(y, m, 15, 8, 10),
        type: TransactionType.INCOME,
        userId: user.id,
        accountId: itau.id,
        categoryId: cat('Salário').id,
      })
    }

    // 13º salário em dezembro
    if (m === 11) {
      tx.push({
        amount: 6500,
        description: '13º salário',
        date: dateInMonth(y, m, 20, 8, 10),
        type: TransactionType.INCOME,
        userId: user.id,
        accountId: itau.id,
        categoryId: cat('Salário').id,
      })
    }

    // Freelance — nem todo mês tem
    const freelanceChance = p === 'good' ? 0.8 : p === 'bad' ? 0.25 : 0.5
    if (Math.random() < freelanceChance) {
      const freelanceDescs = [
        'Projeto site Next.js',
        'Landing page cliente',
        'Consultoria técnica',
        'Desenvolvimento API',
        'Design de interface',
        'Manutenção de sistema',
      ]
      const freelanceVal =
        p === 'good'
          ? randomBetween(2000, 4500)
          : p === 'bad'
            ? randomBetween(400, 1200)
            : randomBetween(1000, 2800)
      tx.push({
        amount: freelanceVal,
        description: randomItem(freelanceDescs),
        date: dateInMonth(y, m, randomDay(10, 25), 14, 18),
        type: TransactionType.INCOME,
        userId: user.id,
        accountId: nubank.id,
        categoryId: cat('Freelance').id,
      })
    }

    // Rendimentos da reserva — todo mês, pouco
    tx.push({
      amount: randomBetween(35, 85),
      description: 'Rendimento CDB',
      date: dateInMonth(y, m, 1, 6, 8),
      type: TransactionType.INCOME,
      userId: user.id,
      accountId: reserva.id,
      categoryId: cat('Rendimentos').id,
    })

    // Pix recebido esporádico (dividir conta, vender algo)
    if (Math.random() < 0.4) {
      tx.push({
        amount: randomBetween(20, 200),
        description: randomItem([
          'Pix divisão da conta',
          'Pix venda Mercado Livre',
          'Pix devolução',
          'Pix aposta amigo',
          'Pix reembolso',
        ]),
        date: dateInMonth(y, m, randomDay(), 10, 22),
        type: TransactionType.INCOME,
        userId: user.id,
        accountId: nubank.id,
        categoryId: cat('Pix Recebido').id,
      })
    }

    // ═══════════ TRANSFERÊNCIAS ENTRE CONTAS ═══════════

    // Itaú → Nubank (pessoa transfere parte do salário para conta do dia a dia)
    const transNubank = randomBetween(2000, 2800)
    tx.push(
      {
        amount: transNubank,
        description: 'Transferência para Nubank',
        date: dateInMonth(y, m, 6, 9, 12),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: itau.id,
        categoryId: cat('Transferência').id,
      },
      {
        amount: transNubank,
        description: 'Transferência recebida Itaú',
        date: dateInMonth(y, m, 6, 9, 12),
        type: TransactionType.INCOME,
        userId: user.id,
        accountId: nubank.id,
        categoryId: cat('Depósito').id,
      },
    )

    // Saque para carteira — 2 a 3 vezes por mês
    const saqueCount = randomInt(2, 3)
    for (let j = 0; j < saqueCount; j++) {
      const saqueVal = randomBetween(150, 400)
      tx.push(
        {
          amount: saqueVal,
          description: 'Saque dinheiro',
          date: dateInMonth(y, m, randomDay(j * 12 + 3, j * 12 + 16), 10, 18),
          type: TransactionType.EXPENSE,
          userId: user.id,
          accountId: nubank.id,
          categoryId: cat('Transferência').id,
        },
        {
          amount: saqueVal,
          description: 'Saque dinheiro',
          date: dateInMonth(y, m, randomDay(j * 12 + 3, j * 12 + 16), 10, 18),
          type: TransactionType.INCOME,
          userId: user.id,
          accountId: carteira.id,
          categoryId: cat('Depósito').id,
        },
      )
    }

    // Reserva mensal — guarda um pouco na poupança/CDB
    if (p !== 'bad') {
      const reservaVal =
        p === 'good' ? randomBetween(500, 1000) : randomBetween(200, 500)
      tx.push(
        {
          amount: reservaVal,
          description: 'Aplicação reserva',
          date: dateInMonth(y, m, 7, 10, 14),
          type: TransactionType.EXPENSE,
          userId: user.id,
          accountId: itau.id,
          categoryId: cat('Transferência').id,
        },
        {
          amount: reservaVal,
          description: 'Aplicação reserva',
          date: dateInMonth(y, m, 7, 10, 14),
          type: TransactionType.INCOME,
          userId: user.id,
          accountId: reserva.id,
          categoryId: cat('Depósito').id,
        },
      )
    }

    // ═══════════ MORADIA ═══════════

    tx.push(
      {
        amount: 1800,
        description: 'Aluguel apartamento',
        date: dateInMonth(y, m, 5, 9, 11),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: itau.id,
        categoryId: cat('Moradia').id,
      },
      {
        amount: randomBetween(380, 480),
        description: 'Condomínio',
        date: dateInMonth(y, m, 10, 9, 12),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: itau.id,
        categoryId: cat('Moradia').id,
      },
    )

    // IPTU parcelado (fev-nov)
    if (m >= 1 && m <= 10) {
      tx.push({
        amount: 185,
        description: 'IPTU parcela',
        date: dateInMonth(y, m, 15, 8, 10),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: itau.id,
        categoryId: cat('Moradia').id,
      })
    }

    // ═══════════ CONTAS DE CASA ═══════════

    // Energia — sazonal
    const energia =
      m >= 10 || m <= 2 ? randomBetween(180, 300) : randomBetween(95, 170)
    tx.push({
      amount: energia,
      description: 'Conta de luz',
      date: dateInMonth(y, m, 12, 8, 14),
      type: TransactionType.EXPENSE,
      userId: user.id,
      accountId: itau.id,
      categoryId: cat('Contas de Casa').id,
    })

    // Água
    tx.push({
      amount: randomBetween(55, 110),
      description: 'Conta de água',
      date: dateInMonth(y, m, 18, 8, 14),
      type: TransactionType.EXPENSE,
      userId: user.id,
      accountId: itau.id,
      categoryId: cat('Contas de Casa').id,
    })

    // Gás — a cada 2-3 meses
    if (Math.random() < 0.4) {
      tx.push({
        amount: randomBetween(75, 110),
        description: 'Botijão de gás',
        date: dateInMonth(y, m, randomDay(5, 20), 10, 16),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: carteira.id,
        categoryId: cat('Contas de Casa').id,
      })
    }

    // Internet
    tx.push({
      amount: 109.9,
      description: 'Internet Vivo Fibra',
      date: dateInMonth(y, m, 15, 6, 8),
      type: TransactionType.EXPENSE,
      userId: user.id,
      accountId: nubank.id,
      categoryId: cat('Contas de Casa').id,
    })

    // Celular
    tx.push({
      amount: 54.9,
      description: 'Plano Claro celular',
      date: dateInMonth(y, m, 22, 6, 8),
      type: TransactionType.EXPENSE,
      userId: user.id,
      accountId: nubank.id,
      categoryId: cat('Contas de Casa').id,
    })

    // ═══════════ ASSINATURAS ═══════════

    tx.push(
      {
        amount: 39.9,
        description: 'Netflix',
        date: dateInMonth(y, m, 8, 3, 6),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubankCredito.id,
        categoryId: cat('Assinaturas').id,
      },
      {
        amount: 21.9,
        description: 'Spotify Premium',
        date: dateInMonth(y, m, 12, 3, 6),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubankCredito.id,
        categoryId: cat('Assinaturas').id,
      },
      {
        amount: 14.9,
        description: 'iCloud 200GB',
        date: dateInMonth(y, m, 15, 3, 6),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubankCredito.id,
        categoryId: cat('Assinaturas').id,
      },
    )

    // Amazon Prime — nem sempre teve
    if (i < 10) {
      tx.push({
        amount: 19.9,
        description: 'Amazon Prime',
        date: dateInMonth(y, m, 5, 3, 6),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubankCredito.id,
        categoryId: cat('Assinaturas').id,
      })
    }

    // ChatGPT Plus
    if (i < 8) {
      tx.push({
        amount: 104,
        description: 'ChatGPT Plus',
        date: dateInMonth(y, m, 20, 3, 6),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubankCredito.id,
        categoryId: cat('Assinaturas').id,
      })
    }

    // ═══════════ SAÚDE ═══════════

    // Plano de saúde
    tx.push({
      amount: 389.9,
      description: 'Plano de saúde Unimed',
      date: dateInMonth(y, m, 10, 6, 8),
      type: TransactionType.EXPENSE,
      userId: user.id,
      accountId: itau.id,
      categoryId: cat('Saúde').id,
    })

    // Academia
    tx.push({
      amount: 109.9,
      description: 'Smart Fit mensalidade',
      date: dateInMonth(y, m, 5, 6, 8),
      type: TransactionType.EXPENSE,
      userId: user.id,
      accountId: nubank.id,
      categoryId: cat('Saúde').id,
    })

    // Farmácia esporádica
    const farmaciaCount = randomInt(0, 2)
    for (let j = 0; j < farmaciaCount; j++) {
      tx.push({
        amount: randomBetween(15, 120),
        description: randomItem([
          'Panvel Farmácias',
          'Farmácia Droga Raia',
          'Farmácia São João',
          'Agafarma Farmácias',
        ]),
        date: dateInMonth(y, m, randomDay(), 9, 20),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: randomItem([nubankCredito.id, nubank.id]),
        categoryId: cat('Saúde').id,
      })
    }

    // Consulta médica eventual
    if (Math.random() < 0.2) {
      tx.push({
        amount: randomBetween(150, 400),
        description: randomItem([
          'Consulta dermatologista',
          'Consulta oftalmologista',
          'Exame de sangue',
          'Dentista',
        ]),
        date: dateInMonth(y, m, randomDay(5, 25), 8, 16),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubankCredito.id,
        categoryId: cat('Saúde').id,
      })
    }

    // ═══════════ EDUCAÇÃO ═══════════

    // Curso online
    tx.push({
      amount: 49.9,
      description: 'Alura assinatura',
      date: dateInMonth(y, m, 1, 3, 6),
      type: TransactionType.EXPENSE,
      userId: user.id,
      accountId: nubankCredito.id,
      categoryId: cat('Educação').id,
    })

    // Livro/curso avulso esporádico
    if (Math.random() < 0.25) {
      tx.push({
        amount: randomBetween(29, 180),
        description: randomItem([
          'Livro Amazon',
          'Curso Udemy',
          'E-book técnico',
          'Livro Submarino',
        ]),
        date: dateInMonth(y, m, randomDay(), 10, 22),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubankCredito.id,
        categoryId: cat('Educação').id,
      })
    }

    // ═══════════ MERCADO ═══════════

    // Supermercado — 3-5 idas grandes por mês
    const mercadoCount = randomInt(3, 5)
    const mercadoDescs = [
      'Beltrame Supermercados',
      'Supermercado Carrefour',
      'Big Supermercados',
      'Rede Super Supermercados',
      'Rede Vivo Supermercados',
    ]
    for (let j = 0; j < mercadoCount; j++) {
      tx.push({
        amount: randomBetween(80, 420),
        description: randomItem(mercadoDescs),
        date: dateInMonth(
          y,
          m,
          randomDay(j * 5 + 1, Math.min((j + 1) * 6, 28)),
          9,
          14,
        ),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: randomItem([nubank.id, nubankCredito.id]),
        categoryId: cat('Mercado').id,
      })
    }

    // Feirinha / hortifruti
    if (Math.random() < 0.6) {
      const feiraCount = randomInt(1, 3)
      for (let j = 0; j < feiraCount; j++) {
        tx.push({
          amount: randomBetween(25, 80),
          description: randomItem([
            'Feira livre',
            'Hortifruti',
            'Sacolão',
            'Quitanda',
          ]),
          date: dateInMonth(y, m, randomDay(), 7, 11),
          type: TransactionType.EXPENSE,
          userId: user.id,
          accountId: carteira.id,
          categoryId: cat('Mercado').id,
        })
      }
    }

    // Padaria — várias vezes por mês
    const padariaCount = randomInt(3, 8)
    for (let j = 0; j < padariaCount; j++) {
      tx.push({
        amount: randomBetween(5, 28),
        description: randomItem([
          'Padaria pão e café',
          'Padaria',
          'Padoca do bairro',
        ]),
        date: dateInMonth(y, m, randomDay(), 6, 9),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: randomItem([carteira.id, nubank.id]),
        categoryId: cat('Mercado').id,
      })
    }

    // ═══════════ RESTAURANTE ═══════════

    // iFood / Rappi
    const deliveryCount =
      p === 'good'
        ? randomInt(5, 10)
        : p === 'bad'
          ? randomInt(2, 5)
          : randomInt(3, 7)
    for (let j = 0; j < deliveryCount; j++) {
      tx.push({
        amount: randomBetween(22, 75),
        description: randomItem([
          'iFood pedido',
          'iFood',
          'Rappi delivery',
          'iFood hamburgueria',
          'iFood japonês',
          'iFood pizza',
          'Rappi mercado',
        ]),
        date: dateInMonth(y, m, randomDay(), 18, 23),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubankCredito.id,
        categoryId: cat('Restaurante').id,
      })
    }

    // Almoço fora (dia de semana)
    const almocoCount = randomInt(2, 6)
    for (let j = 0; j < almocoCount; j++) {
      tx.push({
        amount: randomBetween(25, 55),
        description: randomItem([
          'Almoço executivo',
          'Restaurante por quilo',
          'PF almoço',
          'Marmitaria',
        ]),
        date: dateInMonth(y, m, randomDay(), 11, 14),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: randomItem([nubank.id, nubankCredito.id]),
        categoryId: cat('Restaurante').id,
      })
    }

    // Jantar fora (fim de semana)
    const jantarCount =
      p === 'good'
        ? randomInt(2, 4)
        : p === 'bad'
          ? randomInt(0, 1)
          : randomInt(1, 3)
    for (let j = 0; j < jantarCount; j++) {
      tx.push({
        amount: randomBetween(60, 200),
        description: randomItem([
          'Jantar restaurante',
          'Rodízio japonês',
          'Pizzaria',
          'Churrascaria',
          'Hamburgueria',
          'Jantar italiano',
        ]),
        date: dateInMonth(y, m, randomDay(), 19, 23),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubankCredito.id,
        categoryId: cat('Restaurante').id,
      })
    }

    // Café / lanche rápido
    const cafeCount = randomInt(2, 6)
    for (let j = 0; j < cafeCount; j++) {
      tx.push({
        amount: randomBetween(8, 28),
        description: randomItem([
          'Starbucks',
          'Café padaria',
          'Lanche rápido',
          'Açaí',
          'Suco natural',
          'Cafeteria',
        ]),
        date: dateInMonth(y, m, randomDay(), 14, 18),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: randomItem([carteira.id, nubank.id]),
        categoryId: cat('Restaurante').id,
      })
    }

    // ═══════════ TRANSPORTE ═══════════

    // Gasolina 1-2x mês
    const gasCount = randomInt(1, 2)
    for (let j = 0; j < gasCount; j++) {
      tx.push({
        amount: randomBetween(120, 220),
        description: randomItem([
          'Posto Shell',
          'Posto Ipiranga',
          'Posto BR',
          'Posto Ale',
        ]),
        date: dateInMonth(
          y,
          m,
          randomDay(j * 9 + 1, Math.min((j + 1) * 10, 28)),
          15,
          19,
        ),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubank.id,
        categoryId: cat('Transporte').id,
      })
    }

    // Uber / 99
    const uberCount = randomInt(2, 8)
    for (let j = 0; j < uberCount; j++) {
      tx.push({
        amount: randomBetween(10, 50),
        description: randomItem(['Uber', '99 corrida', 'Uber', 'Uber']),
        date: dateInMonth(y, m, randomDay(), 7, 23),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubankCredito.id,
        categoryId: cat('Transporte').id,
      })
    }

    // Estacionamento
    const estacCount = randomInt(0, 3)
    for (let j = 0; j < estacCount; j++) {
      tx.push({
        amount: randomBetween(8, 30),
        description: randomItem([
          'Estacionamento shopping',
          'Zona Azul',
          'Estacionamento',
        ]),
        date: dateInMonth(y, m, randomDay(), 10, 20),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: randomItem([carteira.id, nubank.id]),
        categoryId: cat('Transporte').id,
      })
    }

    // Lavagem de carro
    if (Math.random() < 0.35) {
      tx.push({
        amount: randomBetween(40, 80),
        description: 'Lavagem do carro',
        date: dateInMonth(y, m, randomDay(10, 25), 9, 14),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubank.id,
        categoryId: cat('Transporte').id,
      })
    }

    // ═══════════ LAZER ═══════════

    const lazerCount =
      p === 'good'
        ? randomInt(3, 7)
        : p === 'bad'
          ? randomInt(1, 3)
          : randomInt(2, 5)

    const lazerOptions = [
      { desc: 'Cinema Cinemark', min: 30, max: 65 },
      { desc: 'Cinema', min: 25, max: 55 },
      { desc: 'Bar com amigos', min: 50, max: 180 },
      { desc: 'Cerveja artesanal', min: 25, max: 60 },
      { desc: 'Balada', min: 40, max: 150 },
      { desc: 'Boliche', min: 30, max: 70 },
      { desc: 'Karaokê', min: 40, max: 90 },
      { desc: 'Escape room', min: 60, max: 120 },
      { desc: 'Parque', min: 15, max: 40 },
      { desc: 'Museu / exposição', min: 20, max: 60 },
      { desc: 'Show', min: 80, max: 300 },
      { desc: 'Ingresso teatro', min: 50, max: 150 },
      { desc: 'Futebol ingresso', min: 40, max: 120 },
      { desc: 'Jogo Steam', min: 30, max: 200 },
    ]

    for (let j = 0; j < lazerCount; j++) {
      const opt = randomItem(lazerOptions)
      tx.push({
        amount: randomBetween(opt.min, opt.max),
        description: opt.desc,
        date: dateInMonth(y, m, randomDay(), 16, 23),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: randomItem([nubankCredito.id, nubank.id]),
        categoryId: cat('Lazer').id,
      })
    }

    // ═══════════ PET ═══════════

    // Ração / petshop
    tx.push({
      amount: randomBetween(80, 160),
      description: randomItem([
        'Ração Golden',
        'PetShop ração e petiscos',
        'Cobasi',
        'Petz',
      ]),
      date: dateInMonth(y, m, randomDay(1, 15), 10, 17),
      type: TransactionType.EXPENSE,
      userId: user.id,
      accountId: nubankCredito.id,
      categoryId: cat('Pet').id,
    })

    // Banho e tosa
    if (Math.random() < 0.5) {
      tx.push({
        amount: randomBetween(50, 90),
        description: 'Banho e tosa',
        date: dateInMonth(y, m, randomDay(10, 25), 9, 14),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubank.id,
        categoryId: cat('Pet').id,
      })
    }

    // Veterinário esporádico
    if (Math.random() < 0.15) {
      tx.push({
        amount: randomBetween(150, 500),
        description: 'Consulta veterinário',
        date: dateInMonth(y, m, randomDay(), 9, 17),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: nubankCredito.id,
        categoryId: cat('Pet').id,
      })
    }

    // ═══════════ ROUPAS ═══════════

    const roupaChance = p === 'good' ? 0.65 : p === 'bad' ? 0.15 : 0.35
    if (Math.random() < roupaChance) {
      const roupaCount = randomInt(1, 3)
      const roupaDescs = [
        'Renner',
        'C&A',
        'Zara',
        'Shein pedido',
        'Nike tênis',
        'Adidas',
        'Hering',
        'Riachuelo',
        'Calça jeans',
        'Camiseta',
        'Sapato',
      ]
      for (let j = 0; j < roupaCount; j++) {
        tx.push({
          amount: randomBetween(40, 350),
          description: randomItem(roupaDescs),
          date: dateInMonth(y, m, randomDay(8, 28), 12, 20),
          type: TransactionType.EXPENSE,
          userId: user.id,
          accountId: nubankCredito.id,
          categoryId: cat('Roupas').id,
        })
      }
    }

    // ═══════════ COMPRAS ═══════════

    const compraChance = p === 'good' ? 0.7 : p === 'bad' ? 0.2 : 0.4
    if (Math.random() < compraChance) {
      const compraCount = randomInt(1, 2)
      for (let j = 0; j < compraCount; j++) {
        tx.push({
          amount: randomBetween(30, 600),
          description: randomItem([
            'Amazon compra',
            'Mercado Livre',
            'Magazine Luiza',
            'Shopee pedido',
            'AliExpress',
            'Fone Bluetooth',
            'Cabo e adaptador',
            'Americanas',
            'Presente amigo',
            'Casas Bahia',
            'Utensílio cozinha',
            'Organização casa',
          ]),
          date: dateInMonth(y, m, randomDay(5, 28), 10, 22),
          type: TransactionType.EXPENSE,
          userId: user.id,
          accountId: nubankCredito.id,
          categoryId: cat('Compras').id,
        })
      }
    }

    // ═══════════ VIAGEM ═══════════

    // Viagem grande 2x ao ano (julho e dezembro/janeiro)
    if (m === 6 || m === 11) {
      const viaDesc = [
        'Passagem aérea Latam',
        'Passagem aérea Gol',
        'Hotel Booking.com',
        'Airbnb hospedagem',
      ]
      tx.push(
        {
          amount: randomBetween(600, 1500),
          description: randomItem(viaDesc),
          date: dateInMonth(y, m, randomDay(1, 15), 10, 22),
          type: TransactionType.EXPENSE,
          userId: user.id,
          accountId: nubankCredito.id,
          categoryId: cat('Viagem').id,
        },
        {
          amount: randomBetween(150, 400),
          description: randomItem([
            'Restaurante viagem',
            'Passeio turístico',
            'Souvenirs',
            'Aluguel de carro',
          ]),
          date: dateInMonth(y, m, randomDay(15, 28), 10, 22),
          type: TransactionType.EXPENSE,
          userId: user.id,
          accountId: nubankCredito.id,
          categoryId: cat('Viagem').id,
        },
      )
    }

    // Viagem curta / bate-volta esporádica
    if (Math.random() < 0.2 && m !== 6 && m !== 11) {
      tx.push({
        amount: randomBetween(100, 400),
        description: randomItem([
          'Pedágio viagem',
          'Pousada fim de semana',
          'Gasolina viagem',
          'Day use resort',
        ]),
        date: dateInMonth(y, m, randomDay(10, 25), 7, 20),
        type: TransactionType.EXPENSE,
        userId: user.id,
        accountId: randomItem([nubank.id, nubankCredito.id]),
        categoryId: cat('Viagem').id,
      })
    }
  }

  // ────────────── Normalizar e salvar ──────────────
  const normalized = tx.map((t) => ({
    ...t,
    descriptionNormalized: t.description ? removeAccents(t.description) : null,
  }))

  await prisma.transaction.createMany({ data: normalized })

  console.log(`✅ Seed concluído: ${normalized.length} transações criadas`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
