'use client'

import './globals.css'
import React from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { AlertProvider, Loader } from 'photo-flow-ui-kit'
import { AuthProvider } from '../lib/utils/auth/feature/authContext'
import { authLink } from '../lib/utils/auth/api/authLink'
import HeaderWrapper from '@/lib/utils/auth/ui/HeaderWrapper'

const httpLink = createHttpLink({
  uri: 'https://inctagram.work/api/v1/graphql',
  credentials: 'include',
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
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
              <div className='flex min-h-[calc(100vh-60px)] items-center justify-center pt-[60px]'>
                {children}
              </div>
            </ApolloProvider>
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
