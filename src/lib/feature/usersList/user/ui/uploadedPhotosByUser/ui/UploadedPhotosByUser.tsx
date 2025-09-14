'use client'

import { useQuery } from '@apollo/client'
import { PostsByUserModel } from '@/lib/types/graphql'
import GET_POSTS_BY_USER from '@/lib/feature/usersList/user/ui/uploadedPhotosByUser/api/getPostsByUser'
import Image from 'next/image'
import { Loader } from 'photo-flow-ui-kit'

type Props = {
  userId: number
}

export default function UploadedPhotosByUser({ userId }: Props) {
  const { data, loading, error } = useQuery<
    { getPostsByUser: PostsByUserModel },
    { userId: number }
  >(GET_POSTS_BY_USER, {
    variables: { userId },
    fetchPolicy: 'cache-first',
  })

  if (!data || error || loading) return <Loader />

  return (
    <div>
      <div className='flex flex-wrap gap-[12px]'>
        {data &&
          data.getPostsByUser.items.map(img => (
            <Image
              priority
              key={img.id}
              width={234}
              height={228}
              src={img.url || '@/../public/no-image.svg'}
              alt={img.id + ''}
            />
          ))}
      </div>
    </div>
  )
}
