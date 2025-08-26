'use client'

import { Header } from 'photo-flow-ui-kit'
import { useAuth } from '../feature/authContext'

export default function HeaderWrapper() {
  const { isAuth } = useAuth()
  return <Header isAuth={isAuth} isSuperAdminPanel/>
}
