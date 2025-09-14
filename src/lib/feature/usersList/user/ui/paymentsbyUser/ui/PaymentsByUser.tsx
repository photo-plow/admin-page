'use client'

import { useQuery } from '@apollo/client'
import GET_PAYMENTS_BY_USER from '@/lib/feature/usersList/user/ui/paymentsbyUser/api/getPaymentsByUser'
import { GetPaymentsByUser } from '@/lib/types/graphql'
import { twMerge } from 'tailwind-merge'
import styles from '@/app/paymentsList/paymentsList.module.css'
import { Loader, Pagination } from 'photo-flow-ui-kit'
import { formatDateToDotFormat } from '@/utils'
import { useState } from 'react'

type GetPaymentsByUserRequest = {
  pageSize: number
  userId: number
  pageNumber: number
}

const tableHeaders = [
  'Date of Payment',
  'End date of subscription',
  'Amount, $',
  'Subscription Type',
  'Payment Type',
]

export default function PaymentsByUser({ userId }: { userId: number }) {
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)

  const { data, loading, error } = useQuery<
    { getPaymentsByUser: GetPaymentsByUser },
    GetPaymentsByUserRequest
  >(GET_PAYMENTS_BY_USER, {
    variables: {
      pageSize,
      pageNumber,
      userId,
    },
  })

  if (loading || !data || error) return <Loader />

  const normalizedData = data.getPaymentsByUser.items.map(el => ({
    id: el.id,
    datePayment: formatDateToDotFormat(el.dateOfPayment),
    dateEnd: formatDateToDotFormat(el.endDate),
    amount: el.price,
    subscriptionType: el.type === 'DAY' ? '1 day' : el.type === 'WEEKLY' ? '7 days' : '1 month',
    paymentMethod: el.paymentType,
  }))

  return (
    <div>
      <table className={twMerge('border-dark-500 w-[972px] border', styles['table-fixed-height'])}>
        <thead className='bg-dark-500 h-[48px]'>
          <tr className='text-medium-14 text-left [&>*]:pl-[24px]'>
            {tableHeaders.map((title, index) => (
              <th key={index + title}>
                <span
                  className={twMerge(
                    'flex h-full items-center',
                    index === 2 ? 'justify-end pr-[58px]' : ''
                  )}
                >
                  {title}
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
              <td>{e.datePayment}</td>
              <td>{e.dateEnd}</td>
              <td className='pr-[58px] text-right'>${e.amount}</td>
              <td>{e.subscriptionType}</td>
              <td className='lowercase first-letter:uppercase'>{e.paymentMethod}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='bg-dark-700 mb-[40px] w-[972px]'>
        <Pagination
          pageSize={pageSize}
          currentPage={pageNumber}
          itemsPerPage={data?.getPaymentsByUser.pageSize}
          totalCount={data?.getPaymentsByUser.totalCount}
          onChangePagination={(pageNumber: number, _itemsPerPage) => setPageNumber(pageNumber)}
          onChangePageSize={value => setPageSize(value)}
        />
      </div>
    </div>
  )
}
