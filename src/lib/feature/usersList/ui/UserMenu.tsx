import React, { useRef } from 'react'

import AccountRemove from '@/assets/icons/accountRemove.svg'
import BanIcon from '@/assets/icons/ban.svg'
import Dots from '@/assets/icons/more-horizontal.svg'
import { Button, Typography } from 'photo-flow-ui-kit'
import Link from 'next/link'

type PostMenuProps = {
  onCloseMenu: () => void
  isUser?: boolean
  openDeleteModal: () => void
  openBanModal: () => void
  userId: string
}

function UserMenu({ onCloseMenu, openDeleteModal, userId }: PostMenuProps) {
function UserMenu({ onCloseMenu, openDeleteModal, openBanModal }: PostMenuProps) {
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
            onCloseMenu()
            openBanModal()
          }}
          variant={'text'}
        >
          <BanIcon className={'fill-light-100 mr-3 h-6 w-5'} />
          <Typography className={'text-light-100'} variant={'regular_text_14'}>
            Ban in the system
          </Typography>
        </Button>
        <Button className={'mb-3 p-0'} variant={'text'}>
          <Dots className={'fill-light-100 mr-3 h-6 w-5'} />
          <Link href={`/usersList/${userId}`} className={'text-light-100 text-regular-14'}>
            More Information
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default UserMenu
