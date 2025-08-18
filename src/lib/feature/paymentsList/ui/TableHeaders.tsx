import Triangle from '@/assets/icons/triangle.svg'
import { twMerge } from 'tailwind-merge'
import { SortBy, SortDirection } from '@/lib/types/graphql'

type Props = {
  title: string
  sortValue?: SortBy
  sortBy: SortBy
  sortDirection: SortDirection | null
  setSortBy: (value: SortBy) => void
  setSortDirection: (value: SortDirection) => void
  setPageNumber: (value: number) => void
}

const TableHeaders = ({
  title,
  sortBy,
  setSortBy,
  sortValue,
  sortDirection,
  setSortDirection,
  setPageNumber,
}: Props) => {
  if (!sortValue) return <>{title}</>
  const headerHandler = () => {
    setSortBy(sortValue)
    setSortDirection(sortDirection === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC)
    setPageNumber(1)
  }
  return (
    <span onClick={headerHandler} className='flex h-full cursor-pointer items-center gap-[9px]'>
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
