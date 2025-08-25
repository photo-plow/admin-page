'use client'

import Dots from '@/assets/icons/more-horizontal.svg'
import BanIcon from '@/assets/icons/ban.svg'
import FilterIcon from '@/assets/icons/filter.svg'
import { useQuery } from '@apollo/client'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { GET_USERS } from '@/lib/feature/usersList/api/adminApi'
import { GetUsersResponse, GetUsersVariables } from '@/lib/types/graphql'
import UserMenu from '@/lib/feature/usersList/ui/UserMenu'
import { ModalWindow, Pagination } from 'photo-flow-ui-kit'
import { formatDateToDotFormat } from '@/utils'
import { MenuConfig } from '@/lib/feature/usersList/ui/MenuConfig'

const headers = [
  { title: 'User ID' },
  { title: 'Username', icon: <FilterIcon className='mx-auto' /> }, // Без иконки
  { title: 'Profile link' },
  { title: 'Date added', icon: <FilterIcon className='mx-auto' /> },
  { title: '' },
]

export default function ListUsers() {
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 8
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeUserId, setActiveUserId] = useState<string | null>(null)
  const [filteredValue, setFilteredValue] = useState<'All' | 'Blocked' | 'Not Blocked'>('All')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const statusFilter =
    filteredValue === 'Blocked' ? 'BLOCKED' : filteredValue === 'Not Blocked' ? 'UNBLOCKED' : 'ALL'

  const { data, loading, error } = useQuery<GetUsersResponse, GetUsersVariables>(GET_USERS, {
    variables: {
      pageSize,
      pageNumber,
      sortBy: 'createdAt',
      sortDirection: 'desc',
      statusFilter,
      searchTerm: debouncedSearch,
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

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(() => search), 500)
    console.log(debouncedSearch)
    return () => clearTimeout(id)
  }, [search])

  useEffect(() => {
    setPageNumber(1)
  }, [filteredValue, debouncedSearch])

  const toggleMenu = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveUserId(prev => (prev === userId ? null : userId))
  }

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage)
  }

  const users = data?.getUsers.users || []

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className='w-[1060px] pt-[60px]'>
      <MenuConfig
        filteredValue={filteredValue}
        setFilteredValue={v => setFilteredValue(v)}
        searchValue={search}
        setSearch={setSearch}
      />

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
              <td className={'flex gap-3 py-[11px] pl-[60px]'}>
                {el.userBan && <BanIcon className={'ml-[-36px] h-[24px] w-[24px]'} />}
                {el.id}
              </td>
              <td className={'py-[12px] pl-[24px]'}>
                {el.profile.firstName} {el.profile.lastName}
              </td>
              <td className={'py-[11px] pl-[24px]'}>{el.userName}</td>
              <td className={'py-[11px] pr-[24px] pl-[24px]'}>
                {formatDateToDotFormat(el.createdAt)}
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
        <Pagination
          currentPage={pageNumber}
          itemsPerPage={pageSize}
          totalCount={data?.getUsers.pagination.totalCount || 0}
          // pageSize={data?.getUsers.pagination.pagesCount || 1}
          onChangePagination={handlePageChange}
          // onChangePageSize={size => {
          //   setPageSize(size)
          //   setPageNumber(1)
          // }}
        />
      </div>
      <ModalWindow open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
