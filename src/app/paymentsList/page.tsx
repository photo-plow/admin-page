'use client'

import { twMerge } from 'tailwind-merge'
import { ChangeEvent, useRef, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import Image from 'next/image'
import { formatDateToDotFormat } from '@/utils'
import { Input, Loader, Pagination } from 'photo-flow-ui-kit'
import { GetPaymentsResponse, SortBy, SortDirection } from '@/lib/types/graphql'
import TableHeaders from '@/lib/feature/paymentsList/ui/TableHeaders'

const customStylesForTable = `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { 
          scrollbar-width: none; 
          -ms-overflow-style: none;
        }
        .table-fixed-height {
          border-collapse: collapse;
        }
        .table-fixed-height thead {
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .table-fixed-height tbody {
          max-height: 366px;
          display: block;
          overflow-y: auto;
        }
        .table-fixed-height thead,
        .table-fixed-height tbody tr {
          display: table;
          table-layout: fixed;
          width: 100%;
        }
      ` // сложные стили для прокрутки строк в таблице

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

const GET_PAYMENTS = gql`
  query GetPayments(
    $pageSize: Int
    $pageNumber: Int
    $sortBy: String
    $sortDirection: SortDirection
    $searchTerm: String
  ) {
    getPayments(
      pageSize: $pageSize
      pageNumber: $pageNumber
      sortBy: $sortBy
      sortDirection: $sortDirection
      searchTerm: $searchTerm
    ) {
      items {
        id
        userId
        paymentMethod
        amount
        currency
        createdAt
        type
        userName
        avatars {
          url
        }
      }
      pagesCount
      page
      pageSize
      totalCount
    }
  }
`

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
    <>
      <style>{customStylesForTable}</style>
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
            <table className='border-dark-500 table-fixed-height mt-[36px] w-[972px] border'>
              <thead className='bg-dark-500 h-[48px]'>
                <tr className='text-medium-14 text-left [&>*]:pl-[24px]'>
                  <th>
                    <TableHeaders
                      title='Full Name'
                      sortValue='userName'
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                      sortDirection={sortDirection}
                      setSortDirection={setSortDirection}
                      setPageNumber={setPageNumber}
                    />
                  </th>
                  <th>
                    <TableHeaders
                      title='Date added'
                      sortValue='createdAt'
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                      sortDirection={sortDirection}
                      setSortDirection={setSortDirection}
                      setPageNumber={setPageNumber}
                    />
                  </th>
                  <th>
                    <TableHeaders
                      title='Amount, $'
                      sortValue='amount'
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                      sortDirection={sortDirection}
                      setSortDirection={setSortDirection}
                      setPageNumber={setPageNumber}
                    />
                  </th>
                  <th>Subscription</th>
                  <th>
                    <TableHeaders
                      title='Payment Method'
                      sortValue='paymentMethod'
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                      sortDirection={sortDirection}
                      setSortDirection={setSortDirection}
                      setPageNumber={setPageNumber}
                    />
                  </th>
                </tr>
              </thead>
              <tbody className='hide-scrollbar'>
                {normalizedData?.map((e, index) => (
                  <tr
                    key={index}
                    className='text-regular-14 border-dark-500 h-[59px] border [&>*]:pl-[24px]'
                  >
                    <td className='flex h-[59px] items-center gap-[12px]'>
                      {e.avatars[1] ? (
                        <Image
                          width={36}
                          height={36}
                          src={e.avatars[1].url}
                          alt={e.userName}
                          className='rounded-full'
                        />
                      ) : (
                        <div className='bg-dark-300 h-[36px] w-[36px] rounded-full'></div>
                      )}

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
                onChangePagination={(pageNumber: number, _itemsPerPage) =>
                  setPageNumber(pageNumber)
                }
                onChangePageSize={value => setPageSize(value)}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default PaymentsList
