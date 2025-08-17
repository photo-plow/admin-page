import Triangle from '@/assets/icons/triangle.svg'
import { twMerge } from 'tailwind-merge'
import { SortBy, SortDirection } from '@/lib/types/graphql'

const TableHeaders = ({
  title,
  sortBy,
  setSortBy,
  sortValue,
  sortDirection,
  setSortDirection,
  setPageNumber,
}: {
  title: string
  sortValue: SortBy
  sortBy: SortBy
  sortDirection: SortDirection | null
  setSortBy: (value: SortBy) => void
  setSortDirection: (value: SortDirection) => void
  setPageNumber: (value: number) => void
}) => {
  return (
    <span
      onClick={() => {
        setSortBy(sortValue)
        setSortDirection(
          sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC
        )
        setPageNumber(1)
      }}
      className='flex h-full cursor-pointer items-center gap-[9px]'
    >
      {title}
      <div className='flex flex-col gap-[3px]'>
        <Triangle
          className={twMerge(
            'h-[6px] w-[8px]',
            sortValue === sortBy && sortDirection === SortDirection.ASC
              ? 'text-white'
              : 'text-dark-100'
          )}
        />
        <Triangle
          className={twMerge(
            'text-dark-100 h-[6px] w-[8px] rotate-180',
            sortValue === sortBy && sortDirection === SortDirection.DESC
              ? 'text-white'
              : 'text-dark-100'
          )}
        />
      </div>
    </span>
  )
}

export default TableHeaders
