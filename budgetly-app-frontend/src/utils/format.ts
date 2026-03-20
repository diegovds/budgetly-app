export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: Date): string {
  let formatted = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))

  formatted = formatted.replace('. de ', ', ')
  formatted = formatted.replace(' de ', ' ')

  return formatted
}

export function formatCurrencyString(value: string | number) {
  if (!value) return ''

  const number =
    typeof value === 'number' ? value : Number(value.replace(/\D/g, '')) / 100

  if (isNaN(number)) return ''

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function currencyToNumber(value: string) {
  return Number(
    value
      .replace(/\s/g, '')
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(',', '.'),
  )
}
