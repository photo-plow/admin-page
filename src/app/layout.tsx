'use client'

import './globals.css'
import React from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { AlertProvider, Loader } from 'photo-flow-ui-kit'
import { AuthProvider } from '@/lib/utils/auth/feature/authContext'
import { authLink } from '@/lib/utils/auth/api/authLink'
import HeaderWrapper from '@/lib/utils/auth/ui/HeaderWrapper'
import SidebarWrapper from '@/components/sidebarWrapper/sidebarWrapper'

const httpLink = createHttpLink({
  uri: 'https://inctagram.work/api/v1/graphql',
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPosts: {
            keyArgs: false,
            merge(existing = { items: [] }, incoming) {
              return {
                ...incoming,
                items: [...existing.items, ...incoming.items],
              }
            },
          },
        },
      },
    },
  }),
  defaultOptions: { query: { fetchPolicy: 'network-only' } },
})

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body>
        <div id='alert-root' />
        <AuthProvider
          fallback={
            <div className='flex min-h-screen items-center justify-center'>
              <Loader />
            </div>
          }
        >
          <AlertProvider>
            <ApolloProvider client={client}>
              <HeaderWrapper />
              <SidebarWrapper />
              <div className='min-h-[calc(100vh-60px)] pt-[60px] pl-[244px]'>{children}</div>
            </ApolloProvider>
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
