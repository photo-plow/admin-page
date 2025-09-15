import { gql } from '@apollo/client'

export const GET_USER = gql`
  query GetUser($userId: Int!) {
    getUser(userId: $userId) {
      createdAt
      profile {
        avatars {
          url
        }
        firstName
        lastName
      }
      userName
      id
    }
    #    getPostsByUser(userId: $userId) {
    #      items {
    #        url
    #      }
    #    }
    #    getPaymentsByUser(userId: $userId) {
    #
    #    }
  }
`
