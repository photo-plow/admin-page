import React from 'react'

import { twMerge } from 'tailwind-merge'
import { useMutation } from '@apollo/client'
import { REMOVE_USER } from '@/lib/feature/usersList/api/getUsers'
import { Button, ModalWindow, Typography } from 'photo-flow-ui-kit'

type PostActionsModalProps = {
  open: boolean
  onClose: () => void
  removeEditMode?: () => void
  setIsModalOpen: (isModalOpen: boolean) => void
  userId: number
  type: 'delete' | 'exit'
  className?: string
  confirmText: string
}

function ConfirmModal({
  open,
  onClose,
  userId,
  setIsModalOpen,
  type,
  className,
  confirmText,
  removeEditMode,
}: PostActionsModalProps) {
  const [removeUser] = useMutation(REMOVE_USER, {
    refetchQueries: ['GetUsers'],
  })

  const postRemoveHandler = async () => {
    setIsModalOpen(true)
    try {
      const { data } = await removeUser({
        variables: { userId },
      })
      if (data?.removeUser) {
        console.log('Пользователь успешно удалён')
      } else {
        console.error('Не удалось удалить пользователя')
      }
    } catch (error) {
      console.error('The post has not been found', error)
    } finally {
      setIsModalOpen(false)
    }
  }
  return (
    <ModalWindow
      modalTitle={type === 'delete' ? 'Delete Post' : 'Close Post'}
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

              if (type === 'delete') {
                postRemoveHandler()
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

export default ConfirmModal
