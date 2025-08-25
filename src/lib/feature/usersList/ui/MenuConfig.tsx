'use client'

import { Input, Select } from 'photo-flow-ui-kit'

const sortItems = [{ title: 'All' }, { title: 'Blocked' }, { title: 'Not Blocked' }]

type MenuConfigProps = {
  filteredValue: 'All' | 'Blocked' | 'Not Blocked'
  setFilteredValue: (v: 'All' | 'Blocked' | 'Not Blocked') => void
  searchValue: string
  setSearch: (v: string) => void
}

export const MenuConfig = ({
  filteredValue,
  setFilteredValue,
  searchValue,
  setSearch,
}: MenuConfigProps) => {
  return (
    <div className='mb-6 flex w-full items-center justify-between gap-15'>
      <Input
        autoFocus={!!searchValue.length}
        type='search'
        placeholder='Search'
        className='w-full max-w-[644px]'
        value={searchValue}
        onChange={e => setSearch(e.target.value)}
      />
      <Select
        items={sortItems}
        placeholder='all'
        value={filteredValue}
        onValueChange={(e: 'All' | 'Blocked' | 'Not Blocked') => setFilteredValue(e)}
        className='w-[234px]'
      />
    </div>
  )
}
