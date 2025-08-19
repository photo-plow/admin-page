'use client'

import './globals.css'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Header } from 'photo-flow-ui-kit'

export type AuthContextValue = {
  isAuth: boolean
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthContext.Provider>')
  return ctx
}

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isAuth, setIsAuth] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('AUTH_TOKEN'))
  }, [])

  const authValue = useMemo(() => ({ setToken, isAuth: !!token  }), [isAuth])

  return (
    <html lang='en'>
      <body>
        <AuthContext.Provider value={authValue}>
          <ApolloProvider client={client}>
            <Header isAuth={!!token} />
            <div className='flex min-h-[calc(100vh-60px)] items-center justify-center pt-[60px]'>
              {children}
            </div>
          </ApolloProvider>
        </AuthContext.Provider>
      </body>
    </html>
  )
}
