'use client'
import { useAuth } from '@/app/layout'
import { gql, useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { Button, Card, Input, Typography } from 'photo-flow-ui-kit'
import { useState } from 'react'

const LOGIN_ADMIN = gql`
  mutation loginAd($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      logged
    }
  }
`

const Auth = () => {
  const [email, setEmail] = useState('') //change to ref(rerender)
  const [password, setPassword] = useState('') //change to ref(rerender)

  const [login, { loading, error, data }] = useMutation(LOGIN_ADMIN, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      if (data?.loginAdmin?.logged) {
        const key = btoa(`${email}:${password}`)
        localStorage.setItem('AUTH_TOKEN', key)
        setToken(key)
        router.push('/usersList')
      }
    },
    onError: err => {
      console.error('loginAdmin error:', err)
    },
  })
  const apollo = useApolloClient()
  const router = useRouter()

  const { isAuth, setToken } = useAuth()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ variables: { email, password } })
  }

  return (
    <Card className={`w-[380px] p-6 pb-9`}>
      <Typography variant={'h1'} className={'mb-9 text-center'}>
        Sign In
      </Typography>
      <form onSubmit={onSubmit}>
        <Input
          value={email}
          onChange={e => setEmail(e.target.value)}
          label='Email'
          type='email'
          placeholder='Epam@epam.com'
          className='mb-6'
        />
        <Input
          value={password}
          onChange={e => setPassword(e.target.value)}
          label='Password'
          type='password'
          placeholder='*********'
          className='mb-9'
        />
        <Button type='submit' className='w-full'>
          Sign In
        </Button>
      </form>
    </Card>
  )
}

export default Auth
