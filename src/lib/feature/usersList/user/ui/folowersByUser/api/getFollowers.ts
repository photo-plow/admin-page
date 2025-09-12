import { gql } from '@apollo/client'
import { SortBy } from '@/lib/types/graphql'

const GET_FOLLOWERS_BY_USER = gql`
  query getFollowers(
    $userId: Int!
    $pageSize: Int!
    $pageNumber: Int!
    $sortDirection: SortDirection
    $sortBy: String
  ) {
    getFollowers(
      userId: $userId
      pageSize: $pageSize
      pageNumber: $pageNumber
      sortDirection: $sortDirection
      sortBy: $sortBy
    ) {
      pageSize
      page
      pagesCount
      totalCount
      items {
        userId
        id
        lastName
        firstName
        userName
        createdAt
      }
    }
  }
`

export default GET_FOLLOWERS_BY_USER
