import { gql } from '@apollo/client'

export const GET_USERS = gql`
  query GetUsers($pageSize: Int, $pageNumber: Int, $sortBy: String) {
    getUsers(pageSize: $pageSize, pageNumber: $pageNumber, sortBy: $sortBy) {
      users {
        id
        userName
        createdAt
        email
        profile {
          country
          firstName
          lastName
          userName
        }
        userBan {
          reason
          createdAt
        }
      }
      pagination {
        pagesCount
        page
        pageSize
        totalCount
      }
    }
  }
`
