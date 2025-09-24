import { gql } from '@apollo/client'

export const POST_ADDED = gql`
  subscription PostAdded {
    postAdded {
      id
      createdAt
      description
      ownerId
      updatedAt
      images {
        url
      }
      postOwner {
        id
        userName
        avatars {
          url
        }
      }
    }
  }
`
