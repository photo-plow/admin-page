import React, { useEffect, useRef, useState } from 'react'
import s from './s.module.css'
import { twMerge } from 'tailwind-merge'
import { useMutation } from '@apollo/client'
import { BAN_USER } from '@/lib/feature/usersList/api/getUsers'
import { Button, ModalWindow, Select, Typography } from 'photo-flow-ui-kit'

type PostActionsModalProps = {
  open: boolean
  onClose: () => void
  removeEditMode?: () => void
  setIsModalOpen: (isModalOpen: boolean) => void
  userId: number
  type: 'block' | 'exit'
  className?: string
  confirmText: string
}
type ReasonType = 'Bad behavior' | 'Advertising placement' | 'Another reason'
function BlockUser({
  open,
  onClose,
  userId,
  setIsModalOpen,
  type,
  className,
  confirmText,
}: PostActionsModalProps) {
  const [blockUser] = useMutation(BAN_USER, {
    refetchQueries: ['GetUsers'],
  })
  const [valBlock, setValBlock] = useState<ReasonType>('Another reason')
  const reason = [
    { title: 'Bad behavior' },
    { title: 'Advertising placement' },
    { title: 'Another reason' },
  ]

  const blockUserHandler = async () => {
    setIsModalOpen(true)
    try {
      await blockUser({
        variables: { userId, banReason: valBlock },
      })
    } catch (error) {
      console.error('The user blocking has not been found', error)
    } finally {
      setIsModalOpen(false)
    }
  }

  return (
    <ModalWindow
      modalTitle={type === 'block' ? 'Ban user' : ''}
      open={open}
      className={twMerge('h-[288px] w-[378px]', className)}
      onClose={onClose}
    >
      <div className='mt-7.5 px-6'>
        <div className='pb-[18px]'>
          <Typography variant='regular_text_16'>
            Are you sure to ban this user, <strong>{confirmText}</strong>?
          </Typography>
        </div>
        <div className={''}>
          <Select
            placeholder={'Reason for ban'}
            items={reason}
            value={valBlock}
            onValueChange={setValBlock}
            className={twMerge(s.select, 'bg-dark-100 w-full cursor-pointer')}
          />
        </div>
        <div className='absolute bottom-[36px] flex w-full gap-[70px]'>
          <Button
            variant={'outline'}
            onClick={() => {
              if (type === 'exit') {
                onClose()
              }

              if (type === 'block') {
                blockUserHandler()
              }
            }}
            className='h-[36px] w-[130px]'
          >
            Yes
          </Button>
          <Button onClick={onClose} className='h-[36px] w-[130px]'>
            No
          </Button>
        </div>
      </div>
    </ModalWindow>
  )
}

export default BlockUser
