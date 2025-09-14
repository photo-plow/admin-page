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

export type GetPaymentsByUser = {
  items: Array<{
    id: number
    dateOfPayment: string
    endDate: string
    price: number
    type: 'DAY' | 'WEEKLY' | 'MONTHLY'
    paymentType: 'STRIPE' | 'PAYPAL' | 'CREDIT_CARD'
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

export interface GetUser {
  createdAt: string
  profile: {
    avatars: Array<{ url?: string }>
    firstName?: string
    lastName?: string
  }
  userName: string
  id: number
}

export interface GetFollowersRequest {
  userId: number
  pageSize: number
  pageNumber: number
  sortDirection: SortDirection
  sortBy: SortBy
}

export interface GetFollowers {
  items: Follower[]
  page: number
  pageSize: number
  pagesCount: number
  totalCount: number
}

export interface Follower {
  createdAt: string
  firstName: string
  id: number
  lastName: string
  userId: number
  userName: string
}

export interface ImagePost {
  createdAt: string
  fileSize: number
  height: number
  id: number
  url: string
  width: number
}

export interface PostsByUserModel {
  items: ImagePost[]
  pageSize: number
  pagesCount: number
  totalCount: number
}
