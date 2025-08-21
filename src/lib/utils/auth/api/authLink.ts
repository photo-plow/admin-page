import { setContext } from "@apollo/client/link/context"

export const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('AUTH_TOKEN')
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Basic ${token}` } : {}),
    },
  }
})