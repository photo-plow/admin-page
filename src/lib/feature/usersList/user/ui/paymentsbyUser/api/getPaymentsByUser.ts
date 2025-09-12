import { gql } from '@apollo/client'

const GET_PAYMENTS_BY_USER = gql`
  query GetPaymentsByUser($pageSize: Int!, $userId: Int!, $pageNumber: Int!) {
    getPaymentsByUser(pageSize: $pageSize, userId: $userId, pageNumber: $pageNumber) {
      totalCount
      pagesCount
      pageSize
      page
      items {
        dateOfPayment
        endDate
        id
        paymentType
        price
        type
        payments {
          amount
          currency
        }
      }
    }
  }
`

export default GET_PAYMENTS_BY_USER
