export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type SortBy = 'createdAt' | 'paymentMethod' | 'amount' | 'userName'

export type GetPaymentsResponse = {
  items: Array<{
    id: number
    userId: number
    paymentMethod: 'STRIPE' | 'PAYPAL' | 'CREDIT_CARD'
    amount: number
    currency: string
    createdAt: string
    type: 'DAY' | 'WEEKLY' | 'MONTHLY'
    userName: string
    avatars: Array<{ url: string }>
  }>
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
}
