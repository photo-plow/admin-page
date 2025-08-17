'use client'

import './globals.css'
import React from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Header } from 'photo-flow-ui-kit'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { useAppSelector } from '@/lib/hooks'
import { selectIsAuth } from '@/lib/appSlice'

const httpLink = createHttpLink({
  uri: 'https://inctagram.work/api/v1/graphql',
  credentials: 'include',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('AUTH_TOKEN')
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Basic ${token}` } : {}),
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

export function HeaderContainer() {
  const isAuth = useAppSelector(selectIsAuth)
  return <Header isSuperAdminPanel isAuth={isAuth} />
}

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
            <HeaderContainer />
            <div className='flex min-h-[calc(100vh-60px)] items-center justify-center pt-[60px]'>
              {children}
            </div>
          </ApolloProvider>
        </Provider>
      </body>
    </html>
  )
}
