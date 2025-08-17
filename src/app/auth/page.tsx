import { Button, Card, Input, Typography } from 'photo-flow-ui-kit'

const Auth = () => {
  return (
    <Card className={`w-[380px] p-6 pb-9`}>
      <Typography variant={'h1'} className={'mb-9 text-center'}>
        Sign In
      </Typography>
      <form action='#'>
        <Input label='Email' type='email' placeholder='Epam@epam.com' className='mb-6' />
        <Input label='Password' type='password' placeholder='*********' className='mb-9' />
        <Button type='submit' className='w-full'>
          Sign In
        </Button>
      </form>
    </Card>
  )
}

export default Auth
