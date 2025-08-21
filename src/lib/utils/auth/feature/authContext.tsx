'use client'

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

export type AuthContextValue = {
  token: string | null
  isAuth: boolean
  setToken: React.Dispatch<React.SetStateAction<string | null>>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

export function AuthProvider({
  children,
  fallback = null,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const [token, setToken] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setToken(localStorage.getItem('AUTH_TOKEN'))
    setReady(true)
  }, [])

  const value = useMemo(() => ({ token, isAuth: !!token, setToken }), [token])

  if (!ready) return <>{fallback}</>

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
