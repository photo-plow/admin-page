'use client'
import './globals.css'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/utils/auth/feature/authContext'

export default function Home() {
  const { isAuth } = useAuth()

  const router = useRouter()
  useEffect(() => {
    console.log(isAuth)
    if (isAuth) return router.push('/usersList')
    return router.push('/auth/sign-in')
  }, [isAuth, router])

  return <></>
}
