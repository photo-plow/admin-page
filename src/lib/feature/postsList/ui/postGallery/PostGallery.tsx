'use client'

import Image from 'next/image'
import defaultAvatar from '@/assets/icons/defaultAvatar.jpg'
import Arrow from '@/assets/icons/arrow.svg'
import { ImagePost } from '@/lib/types/graphql'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

export default function PostGallery({ images, postId }: { images: ImagePost[]; postId: number }) {
  const [imageIndex, setImageIndex] = useState(0)

  return (
    <div className='relative w-full'>
      <Image
        width={234}
        height={240}
        src={images[imageIndex]?.url || defaultAvatar}
        alt={'imagePost'}
        style={{ height: 'auto' }}
      />
      {images.length > 1 && (
        <>
          <div className='bg-dark-300 absolute bottom-[8px] left-[50%] flex h-[12px] translate-x-[-50%] items-center gap-[8px] rounded-[2px] px-[8px]'>
            {images?.map((i, index) => (
              <span
                key={`${postId}-${index}`}
                className={twMerge(
                  'h-[6px] w-[6px] rounded-full',
                  index === imageIndex ? 'bg-accent-500' : 'bg-light-100'
                )}
              ></span>
            ))}
          </div>
          <div
            onClick={() =>
              imageIndex === 0 ? setImageIndex(images.length - 1) : setImageIndex(prev => prev - 1)
            }
            className='bg-dark-300 absolute top-[50%] left-[6px] flex h-[24px] w-[24px] translate-y-[-50%] cursor-pointer items-center justify-center rounded-[2px] opacity-70'
          >
            <Arrow className='rotate-180' />
          </div>
          <div
            onClick={() =>
              imageIndex === images.length - 1 ? setImageIndex(0) : setImageIndex(prev => prev + 1)
            }
            className='bg-dark-300 absolute top-[50%] right-[6px] flex h-[24px] w-[24px] translate-y-[-50%] cursor-pointer items-center justify-center rounded-[2px] opacity-70'
          >
            <Arrow />
          </div>
        </>
      )}
    </div>
  )
}
