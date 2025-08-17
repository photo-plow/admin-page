'use client'
import { setIsAuth } from '@/lib/appSlice'
import { useAppDispatch } from '@/lib/hooks'
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()

  const [login, { loading, error, data }] = useMutation(LOGIN_ADMIN, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      if (data?.loginAdmin?.logged) {
        const key = btoa(`${email}:${password}`)
        localStorage.setItem('AUTH_TOKEN', key)
        dispatch(setIsAuth({ isAuth: true }))
        console.log(key)
        console.log(data)
        router.push('/usersList')
      }
    },
    onError: err => {
      console.error('loginAdmin error:', err)
    },
  })
  const apollo = useApolloClient()
  const router = useRouter()

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
