import { gql } from '@apollo/client'

const GET_POSTS_BY_USER = gql`
  query GetPostsByUser($userId: Int!, $endCursor: Int) {
    getPostsByUser(userId: $userId, endCursorId: $endCursor) {
      items {
        id
        url
      }
      pageSize
      pagesCount
      totalCount
    }
  }
`

export default GET_POSTS_BY_USER
