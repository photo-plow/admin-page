import React from 'react'

import { twMerge } from 'tailwind-merge'
import { useMutation } from '@apollo/client'
import { UNBAN_USER } from '@/lib/feature/usersList/api/getUsers'
import { Button, ModalWindow, Typography } from 'photo-flow-ui-kit'

type PostActionsModalProps = {
  open: boolean
  onClose: () => void
  removeEditMode?: () => void
  setIsModalOpen: (isModalOpen: boolean) => void
  userId: number
  type: 'unBan' | 'exit'
  className?: string
  confirmText: string
}

function UnBanUser({
  open,
  onClose,
  userId,
  setIsModalOpen,
  type,
  className,
  confirmText,
  removeEditMode,
}: PostActionsModalProps) {
  const [unbanUser] = useMutation(UNBAN_USER, {
    refetchQueries: ['GetUsers'],
  })

  const unBanUserHandler = async () => {
    setIsModalOpen(true)
    try {
      await unbanUser({
        variables: { userId },
      })
    } catch (error) {
      console.error('The user has not been found', error)
    } finally {
      setIsModalOpen(false)
    }
  }
  return (
    <ModalWindow
      modalTitle={type === 'unBan' ? 'Un-Ban user' : ''}
      open={open}
      className={twMerge('h-[216px] w-[378px]', className)}
      onClose={onClose}
    >
      <div className='relative mt-7.5 px-6'>
        <div className='pb-7.5'>
          <Typography variant='regular_text_16'>{confirmText}</Typography>
        </div>
        <div className='flex justify-end gap-6'>
          <Button
            variant={'outline'}
            onClick={() => {
              if (type === 'exit') {
                onClose()
                removeEditMode!()
              }

              if (type === 'unBan') {
                unBanUserHandler()
              }
            }}
            className='w-24'
          >
            Yes
          </Button>
          <Button onClick={onClose} className='w-24'>
            No
          </Button>
        </div>
      </div>
    </ModalWindow>
  )
}

export default UnBanUser
