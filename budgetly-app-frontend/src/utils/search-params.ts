import { SearchParams } from '@/app/transaction/page'

/**
 * Monta a query string preservando filtros
 */
export function buildQuery(params?: SearchParams, page?: number) {
  const query = new URLSearchParams()

  if (params?.startDate) query.set('startDate', params?.startDate)
  if (params?.endDate) query.set('endDate', params?.endDate)
  if (params?.accountId) query.set('accountId', params?.accountId)
  if (params?.categoryId) query.set('categoryId', params?.categoryId)
  if (params?.search) query.set('search', params?.search)

  query.set('page', String(page))

  return `?${query.toString()}`
}
