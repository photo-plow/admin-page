import React, { useState } from 'react'
import s from './s.module.css'
import { twMerge } from 'tailwind-merge'
import { useMutation } from '@apollo/client'
import { BAN_USER } from '@/lib/feature/usersList/api/getUsers'
import { Button, ModalWindow, Select, Textarea, Typography } from 'photo-flow-ui-kit'

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
  const [valBlock, setValBlock] = useState<ReasonType>('Bad behavior')
  const [customReason, setCustomReason] = useState('')
  const reason = [
    { title: 'Bad behavior' },
    { title: 'Advertising placement' },
    { title: 'Another reason' },
  ]

  const requiresCustomReason = valBlock === 'Another reason'

  const blockUserHandler = async () => {
    setIsModalOpen(true)
    try {
      const finalReason = requiresCustomReason && customReason ? customReason : valBlock
      await blockUser({
        variables: { userId, banReason: finalReason },
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
      className={twMerge('h-[320px] w-[378px]', className)}
      onClose={onClose}
    >
      <div className='mt-7.5 px-6'>
        <div className='pb-[18px]'>
          <Typography variant='regular_text_16'>
            Are you sure to ban this user, <strong>{confirmText}</strong>?
          </Typography>
        </div>
        <div>
          <Select
            placeholder={'Reason for ban'}
            items={reason}
            value={valBlock}
            onValueChange={setValBlock}
            className={twMerge(s.select, 'bg-dark-100 w-full cursor-pointer')}
          />

          {requiresCustomReason && (
            <Textarea
              className={'mt-1 mb-6 w-[327px] resize-none'}
              placeholder={'Please specify the reason...'}
              value={customReason}
              onChange={e => setCustomReason(e.target.value)}
              rows={1}
            />
          )}
        </div>
        <div className='absolute bottom-[30px] flex w-full gap-[68px]'>
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
