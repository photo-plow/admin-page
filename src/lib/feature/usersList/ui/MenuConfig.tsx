'use client'

import { Select } from 'photo-flow-ui-kit'

const sortItems = [{ title: 'All' }, { title: 'Blocked' }, { title: 'Not Blocked' }]

type MenuConfigProps = {
  sortedValue: 'All' | 'Blocked' | 'Not Blocked'
  setSortedValue: (v: 'All' | 'Blocked' | 'Not Blocked') => void
}

export const MenuConfig = ({ sortedValue, setSortedValue }: MenuConfigProps) => {
  return (
    <div>
      <Select
        items={sortItems}
        placeholder='all'
        value={sortedValue}
        onValueChange={(e: 'All' | 'Blocked' | 'Not Blocked') => setSortedValue(e)}
      />
    </div>
  )
}
