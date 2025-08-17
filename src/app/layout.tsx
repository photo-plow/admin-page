'use client'

import './globals.css'
import React from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Header } from 'photo-flow-ui-kit'

const httpLink = createHttpLink({
  uri: 'https://inctagram.work/api/v1/graphql',
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
        <ApolloProvider client={client}>
          <Header isSuperAdminPanel isAuth={true} />
          <div className='w-[1060px] pt-[120px] pl-[244px]'>{children}</div>
        </ApolloProvider>
      </body>
    </html>
  )
}
