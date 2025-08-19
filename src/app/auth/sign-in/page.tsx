'use client'
import { useAuth } from '@/app/layout'
import { gql, useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { Button, Card, Input, Typography, useAlert } from 'photo-flow-ui-kit'
import { useRef } from 'react'

const LOGIN_ADMIN = gql`
  mutation loginAd($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      logged
    }
  }
`

const Auth = () => {
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const { showAlert } = useAlert()!

  const [login, { loading, error, data }] = useMutation(LOGIN_ADMIN, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      if (data?.loginAdmin?.logged) {
        const key = btoa(`${emailRef.current}:${passwordRef.current}`)
        localStorage.setItem('AUTH_TOKEN', key)
        setToken(key)
        router.push('/usersList')
      } else {
        showAlert({ message: 'Неверный логин или пароль', type: 'error' });
      }
    },
    onError: err => {
      console.error('loginAdmin error:', err)
      showAlert({ message: err.message, type: 'error' });
    },
  })
  const router = useRouter()

  const { isAuth, setToken } = useAuth()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const email = emailRef.current?.value || ''
    const password = passwordRef.current?.value || ''
    login({ variables: { email, password } })
  }

  return (
    <Card className={`w-[380px] p-6 pb-9`}>
      <Typography variant={'h1'} className={'mb-9 text-center'}>
        Sign In
      </Typography>
      <form onSubmit={onSubmit}>
        <Input
          ref={emailRef}
          label='Email'
          type='email'
          placeholder='Epam@epam.com'
          className='mb-6'
        />
        <Input
          ref={passwordRef}
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
