'use client'

import Dots from '@/assets/icons/more-horizontal.svg'
import BanIcon from '@/assets/icons/ban.svg'
import FilterIcon from '@/assets/icons/filter.svg'

import { useQuery } from '@apollo/client'

import { useEffect, useRef, useState } from 'react'
// import { formatDateToDotFormat } from '@/utils'
import { twMerge } from 'tailwind-merge'
import { GET_USERS } from '@/lib/feature/usersList/api/adminApi'
import { GetUsersResponse, GetUsersVariables } from '@/lib/types/graphql'
import UserMenu from '@/lib/feature/usersList/ui/UserMenu'
import { ModalWindow } from 'photo-flow-ui-kit'

// import { Pagination } from '@/components/ui/pagination/Pagination'

const headers = [
  { title: 'UserType ID' },
  { title: 'Username', icon: <FilterIcon className='mx-auto' /> }, // Без иконки
  { title: 'Profile link' },
  { title: 'Date added', icon: <FilterIcon className='mx-auto' /> },
  { title: '' },
]

export default function ListUsers() {
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 8
  const [isDelete, setIsDelete] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [activeUserId, setActiveUserId] = useState<string | null>(null)

  const { data, loading, error } = useQuery<GetUsersResponse, GetUsersVariables>(GET_USERS, {
    variables: {
      pageSize,
      pageNumber,
    },
    fetchPolicy: 'cache-and-network', // Для актуальных данных
  })

  const tableRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) {
        setActiveUserId(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const toggleMenu = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveUserId(prev => (prev === userId ? null : userId))
  }

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage)
  }

  useEffect(() => {
    console.log('Current page:', pageNumber, 'GraphQL response:', data?.getUsers)
  }, [data, pageNumber])

  const users = data?.getUsers.users || []
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  console.log(activeUserId)
  return (
    <>
      <table onClick={() => setActiveUserId(null)} ref={tableRef} className={'w-full'}>
        <thead className={'h-[48px] gap-[72px]'}>
          <tr className='bg-dark-500 h-[48px] text-left'>
            {headers.map((header, index) => (
              <th
                key={index}
                className={twMerge(
                  'text-bold-14 items-center py-[12px] pl-[24px]',
                  header.icon && 'flex items-center'
                )}
              >
                {header.title}
                {header.icon && <div className='ml-1'>{header.icon}</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(el => (
            <tr key={el.id} className={'border-dark-500 text-regular-14 h-[49px] border'}>
              <td className={'py-[11px] pl-[24px]'}>
                {el.userBan && <BanIcon className={'h-[24px] w-[24px]'} />}
                {el.id}
              </td>
              <td className={'py-[11px] pl-[24px]'}>{el.userName}</td>
              <td className={'py-[11px] pl-[24px]'}>{el.userName}</td>
              <td className={'py-[11px] pr-[24px] pl-[24px]'}>
                {/*{formatDateToDotFormat(el.createdAt)}*/}
              </td>
              <td className='relative py-[11px] pr-[24px] pl-[24px]'>
                <div className='relative flex justify-end'>
                  <button onClick={e => toggleMenu(el.id, e)} className='rounded p-1'>
                    <Dots className='hover:text-accent-500 h-5 w-5 cursor-pointer' />
                  </button>
                  {activeUserId === el.id && (
                    <div className='absolute top-10 right-6 z-50'>
                      <UserMenu
                        setActiveUserId={setActiveUserId}
                        isUser={true}
                        onCloseMenu={() => setActiveUserId(null)}
                        setIsModalOpen={setIsModalOpen}
                      />
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='overflow-x-auto'>
        {/*<Pagination*/}
        {/*  currentPage={pageNumber}*/}
        {/*  itemsPerPage={pageSize}*/}
        {/*  totalCount={data?.getUsers.pagination.totalCount || 0}*/}
        {/*  pageSize={data?.getUsers.pagination.pagesCount || 1}*/}
        {/*  onChangePagination={handlePageChange}*/}
        {/*  // onChangePageSize={size => {*/}
        {/*  //   setPageSize(size)*/}
        {/*  //   setPageNumber(1)*/}
        {/*  // }}*/}
        {/*/>*/}
      </div>
      <ModalWindow open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
