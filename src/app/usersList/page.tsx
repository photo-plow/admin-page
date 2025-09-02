'use client'

import Dots from '@/assets/icons/more-horizontal.svg'
import BanIcon from '@/assets/icons/ban.svg'
import FilterIcon from '@/assets/icons/filter.svg'
import FilterActiveIcon from '@/assets/icons/filter-active.svg'
import { useQuery } from '@apollo/client'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { GET_USERS } from '@/lib/feature/usersList/api/getUsers'
import { GetUsersResponse, GetUsersVariables, SortBy } from '@/lib/types/graphql'
import UserMenu from '@/lib/feature/usersList/ui/UserMenu'
import { Loader, ModalWindow, Pagination } from 'photo-flow-ui-kit'
import { formatDateToDotFormat } from '@/utils'
import { MenuConfig } from '@/lib/feature/usersList/ui/MenuConfig'
import ConfirmModal from '@/lib/feature/usersList/ui/removeUser/ConfirmModal'

type Header = {
  title: string
  sortByTitle?: SortBy
}

const headers: Header[] = [
  { title: 'User ID' },
  { title: 'Username' },
  { title: 'Profile link', sortByTitle: 'userName' },
  { title: 'Date added', sortByTitle: 'createdAt' },
  { title: '' },
]

export default function ListUsers() {
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 8
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeUserId, setActiveUserId] = useState<number | string | null>(null)
  const [filteredValue, setFilteredValue] = useState<'All' | 'Blocked' | 'Not Blocked'>('All')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  const statusFilter =
    filteredValue === 'Blocked' ? 'BLOCKED' : filteredValue === 'Not Blocked' ? 'UNBLOCKED' : 'ALL'

  console.log(activeUserId)
  const { data, loading, error } = useQuery<GetUsersResponse, GetUsersVariables>(GET_USERS, {
    variables: {
      pageSize,
      pageNumber,
      sortBy: sortBy,
      sortDirection: sortDirection,
      statusFilter,
      searchTerm: debouncedSearch,
    },
    fetchPolicy: 'cache-and-network',
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

  const onSort = (item: { title: string; sortByTitle?: SortBy }) => {
    if (!item.sortByTitle) return
    if (item.sortByTitle === sortBy) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else {
        setSortDirection('asc')
      }
    }
    setSortBy(item.sortByTitle)
  }

  const users = data?.getUsers.users || []

  if (loading) return <Loader />
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className='w-[1060px] pt-[60px]'>
      <MenuConfig
        filteredValue={filteredValue}
        setFilteredValue={v => setFilteredValue(v)}
        searchValue={search}
        setSearch={setSearch}
      />

      <table onClick={() => setActiveUserId(-1)} ref={tableRef} className={'w-full'}>
        <thead>
          <tr className='bg-dark-500 h-[48px] text-left'>
            {headers.map((header, index) => (
              <th
                onClick={() => onSort(header)}
                key={index}
                className={'text-bold-14 items-center py-[12px] pl-[24px]'}
              >
                <div
                  className={twMerge(
                    'inline-flex items-center',
                    header.sortByTitle && 'cursor-pointer',
                    'whitespace-nowrap'
                  )}
                >
                  <span>{header.title}</span>
                  {header.sortByTitle && (
                    <div className='ml-1'>
                      {header.sortByTitle === sortBy ? (
                        <FilterActiveIcon className='w-2.5' />
                      ) : (
                        <FilterIcon />
                      )}
                    </div>
                  )}
                </div>
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
                        isUser={true}
                        onCloseMenu={() => setActiveUserId(null)}
                        openDeleteModal={() => {
                          setSelectedUserId(Number(el.id))
                          setIsModalOpen(true)
                        }}
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
          onChangePagination={handlePageChange}
        />
      </div>
      {/*<ModalWindow open={isModalOpen} onClose={() => setIsModalOpen(false)} />*/}
      {
        <ConfirmModal
          open={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={Number(selectedUserId)}
          type='delete'
          confirmText='Are you sure you want to delete this user?'
        />
      }
    </div>
  )
}
