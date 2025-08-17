'use client'

import './globals.css'
import React from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Header } from 'photo-flow-ui-kit'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'

const httpLink = createHttpLink({
  uri: 'https://inctagram.work/api/v1/graphql',
  credentials: 'include',
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: 'Basic YWRtaW5AZ21haWwuY29tOmFkbWlu', // hardcode
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    },
  },
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <Provider store={store}>
        <ApolloProvider client={client}>
          <Header isSuperAdminPanel isAuth={true} />
          <div className='flex min-h-[calc(100vh-60px)] items-center justify-center pt-[60px]'>
            {children}
          </div>
        </ApolloProvider>
        </Provider>
      </body>
    </html>
  )
}
