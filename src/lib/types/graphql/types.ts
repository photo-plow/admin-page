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

export interface Profile {
  firstName: string
  lastName: string
  userName: string
  country: string
}

export interface UserBan {
  reason: string
  createdAt: string
}

export interface UserType {
  id: string
  userName: string
  email: string
  createdAt: string
  profile: Profile
  userBan: UserBan | null
}

export interface Pagination {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
}

export interface GetUsersResponse {
  getUsers: {
    users: UserType[]
    pagination: Pagination
  }
}

export interface GetUsersVariables {
  pageSize?: number
  pageNumber?: number
  sortBy: string
  sortDirection: string
  statusFilter: string
  searchTerm: string | undefined
}
export interface RemoveUser {
  userId: number
}
// type GetUsersResponse = {
//   users: Array<{
//     id: number
//     createAt: string
//     userName: string
//     profile: Array<{ firstName: String; lastName: String }>
//   }>
//   pagesCount: number
//   page: number
//   pageSize: number
//   totalCount: number
// }
