import { Sidebar } from 'photo-flow-ui-kit'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import userlists from '@/assets/icons/userLists.svg'
import statistics from '@/assets/icons/statistics.svg'
import paymentsList from '@/assets/icons/paymentsList.svg'
import postsList from '@/assets/icons/postsList.svg'
import { useAuth } from '@/lib/utils/auth/feature/authContext'

const mainMenuItems = [
  {
    title: 'Users list',
    url: '/usersList',
    icon: userlists,
  },
  {
    title: 'Statistics',
    url: '#',
    icon: statistics,
  },
  {
    title: 'Payments list',
    url: '/paymentsList',
    icon: paymentsList,
  },
  {
    title: 'Posts list',
    url: '#',
    icon: postsList,
  },
]

export default function SidebarWrapper() {
  const email = 'admin@gmail.com'

  const { isAuth, setToken } = useAuth()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const clearAuthToken = () => {
    setIsModalOpen(false)
    setToken(null)
    localStorage.removeItem('AUTH_TOKEN')
    router.push('/auth/sign-in')
  }

  return (
    <Sidebar
      menuItems={mainMenuItems}
      email={email}
      isAuth={isAuth}
      isModalOpen={isModalOpen}
      logoutHandlerAction={clearAuthToken}
      setIsModalOpenAction={setIsModalOpen}
    />
  )
}
