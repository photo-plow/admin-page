'use client'

import Link from 'next/link'
import ArrowBack from '@/assets/icons/arrow-back.svg'
import { Loader, Tabs, TabsContent, TabsList, TabsTrigger, Typography } from 'photo-flow-ui-kit'
import { useParams } from 'next/navigation'
import { useQuery } from '@apollo/client'
import { GET_USER } from '@/lib/feature/usersList/user/api/getUser'
import Image from 'next/image'
import { GetUser } from '@/lib/types/graphql'
import DefaultAvatar from '@/assets/icons/defaultAvatar.jpg'
import { formatDateToDotFormat } from '@/utils'
import UploadedPhotosByUser from '@/lib/feature/usersList/user/ui/uploadedPhotosByUser/ui/UploadedPhotosByUser'
import PaymentsByUser from '@/lib/feature/usersList/user/ui/paymentsbyUser/ui/PaymentsByUser'
import FollowersByUser from '@/lib/feature/usersList/user/ui/folowersByUser/ui/FollowersByUser'
import GetFollowing from '@/lib/feature/usersList/user/ui/followingByUser/ui/GetFollowing'

export default function User() {
  const { user } = useParams()

  const { data, loading, error } = useQuery<{ getUser: GetUser }, { userId: number }>(GET_USER, {
    variables: { userId: Number(user) },
    fetchPolicy: 'cache-first',
  })

  if (loading) return <Loader />

  if (Object.is(NaN, Number(user)) || !data || error)
    return <h2 className='fixed top-[50%] left-[50%] translate-y-[-50%]'>No valid userId</h2>

  const fullName =
    (data?.getUser.profile.firstName || ' ') + ' ' + (data?.getUser.profile.lastName || ' ')

  return (
    <div className='justify-center pt-[24px]'>
      <div className='flex w-[972px] flex-col'>
        <Link href='/usersList' className='flex gap-[12px]'>
          <ArrowBack className='h-[24px] w-[24px]' />
          <Typography variant='medium_text_14'>Back to Users List</Typography>
        </Link>
        <div className='mt-[24px] flex gap-[24px]'>
          <Image
            width={60}
            height={60}
            src={data?.getUser?.profile?.avatars?.[0]?.url || DefaultAvatar}
            alt={'avatar'}
            className='rounded-full'
          />
          <div>
            <Typography variant='h1'>{fullName}</Typography>
            <Typography variant='regular_text_14' className='underline'>
              {data?.getUser.userName}
            </Typography>
          </div>
        </div>
        <div className='mt-[19px] flex gap-[120px]'>
          <div>
            <Typography variant='regular_text_14' className='text-gray-400'>
              UserID
            </Typography>
            <Typography variant='regular_text_14'>{data?.getUser.id}</Typography>
          </div>
          <div>
            <Typography variant='regular_text_14' className='text-gray-400'>
              Profile Creation Date
            </Typography>
            <Typography variant='regular_text_14'>
              {data?.getUser?.createdAt && formatDateToDotFormat(data.getUser.createdAt)}
            </Typography>
          </div>
        </div>
      </div>

      <Tabs defaultValue='Uploaded files' className='mt-[29px] max-w-[972px]'>
        <TabsList className='flex w-full'>
          <TabsTrigger value='Uploaded files' className='flex-1'>
            Uploaded photos
          </TabsTrigger>
          <TabsTrigger value='Payments' className='flex-1'>
            Payments
          </TabsTrigger>
          <TabsTrigger value='Followers' className='flex-1'>
            Followers
          </TabsTrigger>
          <TabsTrigger value='Following' className='flex-1'>
            Following
          </TabsTrigger>
        </TabsList>
        <TabsContent value='Uploaded files'>
          <UploadedPhotosByUser userId={data.getUser.id} />
        </TabsContent>
        <TabsContent value='Payments'>
          <PaymentsByUser userId={data.getUser.id} />
        </TabsContent>
        <TabsContent value='Followers'>
          <FollowersByUser userId={data.getUser.id} />
        </TabsContent>
        <TabsContent value='Following'>
          <GetFollowing userId={data.getUser.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
