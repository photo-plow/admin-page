'use client'

import { twMerge } from 'tailwind-merge'
import styles from '@/app/paymentsList/paymentsList.module.css'
import Triangle from '@/assets/icons/triangle.svg'
import { GetFollowers, SortBy, SortDirection } from '@/lib/types/graphql'
import { Pagination } from 'photo-flow-ui-kit'
import { formatDateToDotFormat } from '@/utils'

type Props = {
  data: GetFollowers
  tableHeaders: Array<{ title: string; sortValue?: SortBy }>
  sortBy: SortBy
  sortDirection: SortDirection
  sortByAction: (value: SortBy) => void
  sortDirectionAction: (value: SortDirection) => void
  pageSize: number
  pageSizeAction: (value: number) => void
  pageNumber: number
  pageNumberAction: (value: number) => void
}

export default function FollowersTable({
  data,
  tableHeaders,
  sortBy,
  sortDirection,
  pageSize,
  pageSizeAction,
  pageNumberAction,
  pageNumber,
  sortDirectionAction,
  sortByAction,
}: Props) {
  const normalizedData = data?.items.map(elem => {
    let fullName = ''
    if (elem.firstName) fullName += elem.firstName
    if (elem.lastName) fullName += elem.lastName
    return {
      createdAt: formatDateToDotFormat(elem.createdAt),
      fullName: fullName,
      id: elem.id,
      userName: elem.userName,
      userId: elem.userId,
    }
  })

  const headerHandler = (sortValue?: SortBy) => {
    if (sortValue) {
      sortByAction(sortValue)
      sortDirectionAction(
        sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC
      )
      pageNumberAction(1)
    }
  }

  return (
    <>
      <table className={twMerge('border-dark-500 w-[972px] border', styles['table-fixed-height'])}>
        <thead className='bg-dark-500 h-[48px]'>
          <tr className='text-medium-14 text-left [&>*]:pl-[24px]'>
            {tableHeaders.map((header, index) => (
              <th key={index}>
                <span
                  onClick={() => headerHandler(header.sortValue)}
                  className='flex h-full cursor-pointer items-center gap-[9px]'
                >
                  {header.title}
                  {header.sortValue && (
                    <div className='flex flex-col gap-[3px]'>
                      <Triangle
                        className={twMerge(
                          'h-[6px] w-[8px]',
                          header.sortValue === sortBy && sortDirection === SortDirection.ASC
                            ? 'text-white'
                            : 'text-dark-100'
                        )}
                      />
                      <Triangle
                        className={twMerge(
                          'text-dark-100 h-[6px] w-[8px] rotate-180',
                          header.sortValue === sortBy && sortDirection === SortDirection.DESC
                            ? 'text-white'
                            : 'text-dark-100'
                        )}
                      />
                    </div>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={twMerge(styles['hide-scrollbar'], styles['hide-scrollbar::-webkit-scrollbar'])}
        >
          {normalizedData?.map(e => (
            <tr
              key={e.id}
              className='text-regular-14 border-dark-500 h-[47px] border [&>*]:pl-[24px]'
            >
              <td>{e.userId}</td>
              <td className='underline'>{e.userName}</td>
              <td>{e.fullName}</td>
              <td>{e.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='bg-dark-700 mt-[18px] h-[80px] w-[972px]'>
        <Pagination
          pageSize={pageSize}
          currentPage={pageNumber}
          itemsPerPage={data?.pageSize}
          totalCount={data?.totalCount}
          onChangePagination={(pageNumber: number, _itemsPerPage) => pageNumberAction(pageNumber)}
          onChangePageSize={value => pageSizeAction(value)}
        />
      </div>
    </>
  )
}
