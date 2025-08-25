'use client'

import { Input, Select } from 'photo-flow-ui-kit'

const sortItems = [{ title: 'All' }, { title: 'Blocked' }, { title: 'Not Blocked' }]

type MenuConfigProps = {
  sortedValue: 'All' | 'Blocked' | 'Not Blocked'
  setSortedValue: (v: 'All' | 'Blocked' | 'Not Blocked') => void
}

export const MenuConfig = ({ sortedValue, setSortedValue }: MenuConfigProps) => {
  return (
    <div className='flex w-full gap-15 justify-between items-center mb-6'>
      <Input type='search' placeholder='Search' className='max-w-[644px] w-full'/>
      <Select
        items={sortItems}
        placeholder='all'
        value={sortedValue}
        onValueChange={(e: 'All' | 'Blocked' | 'Not Blocked') => setSortedValue(e)}
        className='w-[234px]'
      />
    </div>
  )
}
