import React, { useRef } from 'react'

import AccountRemove from '@/assets/icons/accountRemove.svg'
import BanIcon from '@/assets/icons/ban.svg'
import Dots from '@/assets/icons/more-horizontal.svg'
import { Button, Typography } from 'photo-flow-ui-kit'
import ConfirmModal from '@/lib/feature/usersList/ui/removeUser/ConfirmModal'

type PostMenuProps = {
  onCloseMenu: () => void
  isUser?: boolean

  openDeleteModal: () => void
}

function UserMenu({ onCloseMenu, openDeleteModal }: PostMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={menuRef}
      className='border-dark-100 bg-dark-500 absolute -top-[11px] -right-[18px] flex h-[128px] w-[178px] border p-3 shadow-lg'
    >
      <div>
        <Button
          className='text-light-100 hover:text-light-100 mb-3 p-0'
          onClick={() => {
            onCloseMenu()
            openDeleteModal()
          }}
          variant='text'
        >
          <AccountRemove className='mr-3 h-5 w-5' />
          <Typography variant='regular_text_14'>Delete User</Typography>
        </Button>
        <Button
          className={'mb-3 p-0'}
          onClick={() => {
            alert(`Is isn't your user!`)
          }}
          variant={'text'}
        >
          <BanIcon className={'fill-light-100 mr-3 h-6 w-5'} />
          <Typography className={'text-light-100'} variant={'regular_text_14'}>
            Ban in the system
          </Typography>
        </Button>
        <Button
          className={'mb-3 p-0'}
          onClick={() => {
            alert(`Is isn't your post!`)
          }}
          variant={'text'}
        >
          <Dots className={'fill-light-100 mr-3 h-6 w-5'} />
          <Typography className={'text-light-100'} variant={'regular_text_14'}>
            More Information
          </Typography>
        </Button>
      </div>
    </div>
  )
}

export default UserMenu
