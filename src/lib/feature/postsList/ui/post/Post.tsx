'use client'

import Ban from '@/assets/icons/ban.svg'
import Image from 'next/image'
import { Button, Typography } from 'photo-flow-ui-kit'
import defaultAvatar from '@/assets/icons/defaultAvatar.jpg'
import { RefObject, useState } from 'react'
import { ImagePost } from '@/lib/types/graphql'
import { timeAgo } from '@/utils'
import { twMerge } from 'tailwind-merge'
import PostGallery from '@/lib/feature/postsList/ui/postGallery/PostGallery'
import BlockUser from '@/lib/feature/usersList/ui/blockUser/BlockUser'

type Props = {
  ref: RefObject<HTMLDivElement | null> | null
  images: ImagePost[]
  username: string
  avatar: string | null
  description: string
  created: string
  postId: number
  userId: number
}

export default function Post({
  description,
  avatar,
  username,
  images,
  created,
  postId,
  ref,
  userId,
}: Props) {
  const [showMore, setShowMore] = useState(false)
  const [isBanModalOpen, setIsBanModalOpen] = useState(false)

  return (
    <div className='relative h-[391px] w-[234px]' ref={ref}>
      <PostGallery images={images} postId={postId} />
      <div
        className={twMerge('bg-dark-700 pt-[12px]', showMore ? 'absolute bottom-0' : 'relative')}
      >
        <div className='relative flex items-center'>
          <Image
            width={36}
            height={36}
            className='rounded-full'
            src={avatar || defaultAvatar}
            alt={username}
          />
          <Typography variant='h3' className='ml-[12px]'>
            {username}
          </Typography>
          <Ban
            className='absolute right-[0px] h-[24px] w-[24px]'
            onClick={() => setIsBanModalOpen(true)}
          />
        </div>
        <Typography variant='small_text' className='text-light-900 mt-[12px]'>
          {timeAgo(created)}
        </Typography>
        <Typography
          variant='regular_text_14'
          className='mt-[3px] mb-[17px] max-w-[234px] break-words'
        >
          {description.length > 81 ? (
            <>
              {showMore ? (
                <>
                  {description + '  '}
                  <Button
                    variant='text'
                    className='inline-block p-0 text-[14px] underline'
                    onClick={() => setShowMore(false)}
                  >
                    Hide
                  </Button>
                </>
              ) : (
                <>
                  {description.slice(0, 81) + '... '}
                  <Button
                    variant='text'
                    className='inline-block p-0 text-[14px] underline'
                    onClick={() => setShowMore(true)}
                  >
                    Show more
                  </Button>
                </>
              )}
            </>
          ) : (
            description
          )}
        </Typography>
      </div>
      <BlockUser
        open={isBanModalOpen}
        setIsModalOpen={setIsBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        userId={userId}
        type='block'
        confirmText={`Are you sure to ban this user, ${username}?`}
      />
    </div>
  )
}
