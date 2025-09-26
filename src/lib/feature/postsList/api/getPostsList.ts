import { gql } from '@apollo/client'

export const GET_POSTS_LIST = gql`
  query GetPostsList(
    $endCursorPostId: Int
    $searchTerm: String
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
  ) {
    getPosts(
      pageSize: $pageSize
      sortDirection: $sortDirection
      endCursorPostId: $endCursorPostId
      sortBy: $sortBy
      searchTerm: $searchTerm
    ) {
      pageSize
      pagesCount
      totalCount
      items {
        id
        createdAt
        description
        ownerId
        updatedAt
        postOwner {
          id
          userName
          avatars {
            url
          }
        }
        images {
          url
        }
      }
    }
  }
`
