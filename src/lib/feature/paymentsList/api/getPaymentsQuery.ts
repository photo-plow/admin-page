import { gql } from '@apollo/client'

export const GET_PAYMENTS = gql`
  query GetPayments(
    $pageSize: Int
    $pageNumber: Int
    $sortBy: String
    $sortDirection: SortDirection
    $searchTerm: String
  ) {
    getPayments(
      pageSize: $pageSize
      pageNumber: $pageNumber
      sortBy: $sortBy
      sortDirection: $sortDirection
      searchTerm: $searchTerm
    ) {
      items {
        id
        userId
        paymentMethod
        amount
        currency
        createdAt
        type
        userName
        avatars {
          url
        }
      }
      pagesCount
      page
      pageSize
      totalCount
    }
  }
`
