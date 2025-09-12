import { gql } from '@apollo/client'

const GET_FOLLOWING_BY_USER = gql`
  query GetFollowing(
    $userId: Int!
    $pageSize: Int!
    $sortBy: String
    $sortDirection: SortDirection
    $pageNumber: Int!
  ) {
    getFollowing(
      userId: $userId
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      pageNumber: $pageNumber
    ) {
      page
      pageSize
      totalCount
      pagesCount
      items {
        userId
        createdAt
        userName
        firstName
        lastName
        id
      }
    }
  }
`

export default GET_FOLLOWING_BY_USER
