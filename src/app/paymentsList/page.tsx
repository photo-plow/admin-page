'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import { twMerge } from 'tailwind-merge'
import { Input, Loader, Pagination } from 'photo-flow-ui-kit'
import { GET_PAYMENTS } from '@/lib/feature/paymentsList/api/getPaymentsQuery'
import TableHeaders from '@/lib/feature/paymentsList/ui/TableHeaders'
import { GetPaymentsResponse, SortBy, SortDirection } from '@/lib/types/graphql'
import { formatDateToDotFormat } from '@/utils'
import Image from 'next/image'
import styles from './paymentsList.module.css'
import defaultAvatar from '@/assets/icons/defaultAvatar.jpg'

const costPayments = {
  DAY: {
    amount: 10,
    typeDescription: '1 day',
  },
  WEEKLY: {
    amount: 50,
    typeDescription: '7 days',
  },
  MONTHLY: {
    amount: 100,
    typeDescription: '1 month',
  },
}
const paymentsType = {
  STRIPE: 'Stripe',
  PAYPAL: 'PayPal',
  CREDIT_CARD: 'Credit Card',
}

const tableHeaders = [
  {
    title: 'Full Name',
    sortValue: 'userName',
  },
  {
    title: 'Date added',
    sortValue: 'createdAt',
  },
  {
    title: 'Amount, $',
    sortValue: 'amount',
  },
  { title: 'Subscription' },
  {
    title: 'Payment Method',
    sortValue: 'paymentMethod',
  },
] satisfies Array<{ title: string; sortValue?: SortBy }>

const PaymentsList = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>('createdAt')
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, error, loading, refetch } = useQuery<{
    getPayments: GetPaymentsResponse
  }>(GET_PAYMENTS, {
    variables: {
      searchTerm: inputRef.current?.value || '',
      pageSize,
      pageNumber,
      sortDirection,
      sortBy,
    },
  })

  if (error) {
    return (
      <div className='text-center'>
        <h1>Ooops... reload page please.</h1>
      </div>
    )
  }

  const normalizedData = data?.getPayments.items.map(elem => {
    return {
      dateAdded: formatDateToDotFormat(elem.createdAt),
      paymentMethod: paymentsType[elem.paymentMethod],
      amount: `${costPayments[elem.type].amount}`,
      subscription: costPayments[elem.type].typeDescription,
      userName: elem.userName,
      avatars: elem.avatars,
    }
  })

  async function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setPageNumber(1)
    await refetch({ searchTerm: e.target.value, pageNumber: 1 })
  }

  return (
    <div className={twMerge('flex h-[624px] flex-col')}>
      <Input
        ref={inputRef}
        type='search'
        placeholder='Search'
        className='h-[36px] w-[972px]'
        onChange={handleInput}
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          <table
            className={twMerge(
              'border-dark-500 mt-[36px] w-[972px] border',
              styles['table-fixed-height']
            )}
          >
            <thead className='bg-dark-500 h-[48px]'>
              <tr className='text-medium-14 text-left [&>*]:pl-[24px]'>
                {tableHeaders.map((header, index) => (
                  <th key={index}>
                    <TableHeaders
                      title={header.title}
                      sortValue={header.sortValue}
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                      sortDirection={sortDirection}
                      setSortDirection={setSortDirection}
                      setPageNumber={setPageNumber}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={twMerge(
                styles['hide-scrollbar'],
                styles['hide-scrollbar::-webkit-scrollbar']
              )}
            >
              {normalizedData?.map((e, index) => (
                <tr
                  key={index}
                  className='text-regular-14 border-dark-500 h-[59px] border [&>*]:pl-[24px]'
                >
                  <td className='flex h-[59px] items-center gap-[12px]'>
                    <Image
                      width={36}
                      height={36}
                      src={e.avatars[1]?.url || defaultAvatar}
                      alt={e.userName}
                      className='rounded-full'
                    />
                    {e.userName.length <= 13 ? e.userName : e.userName.slice(0, 12) + '...'}
                  </td>
                  <td>{e.dateAdded}</td>
                  <td>{e.amount}$</td>
                  <td>{e.subscription}</td>
                  <td>{e.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='bg-dark-700 mt-[18px] h-[80px] w-[972px]'>
            <Pagination
              pageSize={pageSize}
              currentPage={pageNumber}
              itemsPerPage={data?.getPayments.pageSize}
              totalCount={data?.getPayments.totalCount}
              onChangePagination={(pageNumber: number, _itemsPerPage) => setPageNumber(pageNumber)}
              onChangePageSize={value => setPageSize(value)}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default PaymentsList
