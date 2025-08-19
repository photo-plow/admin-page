import { gql } from "@apollo/client";

export const LOGIN_ADMIN = gql`
  mutation loginAd($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      logged
    }
  }
`