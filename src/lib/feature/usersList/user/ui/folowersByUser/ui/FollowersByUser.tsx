'use client'

import { Loader } from 'photo-flow-ui-kit'
import { GetFollowers, GetFollowersRequest, SortBy, SortDirection } from '@/lib/types/graphql'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import GET_FOLLOWERS_BY_USER from '@/lib/feature/usersList/user/ui/folowersByUser/api/getFollowers'
import FollowersTable from '@/lib/feature/usersList/user/ui/followersTable/FollowersTable'

const tableHeaders = [
  { title: 'User ID' },
  {
    title: 'Profile link',
    sortValue: 'userName',
  },
  { title: 'Username' },
  {
    title: 'Subscription Date',
    sortValue: 'createdAt',
  },
] satisfies Array<{ title: string; sortValue?: SortBy }>

export default function FollowersByUser({ userId }: { userId: number }) {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC)
  const [sortBy, setSortBy] = useState<SortBy>('createdAt')

  const { data, loading, error } = useQuery<{ getFollowers: GetFollowers }, GetFollowersRequest>(
    GET_FOLLOWERS_BY_USER,
    {
      variables: {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        userId,
      },
      fetchPolicy: 'cache-first',
    }
  )
  if (!data || error || loading) return <Loader />

  return (
    <div>
      <FollowersTable
        tableHeaders={tableHeaders}
        data={data?.getFollowers}
        sortBy={sortBy}
        sortByAction={setSortBy}
        sortDirection={sortDirection}
        sortDirectionAction={setSortDirection}
        pageSize={pageSize}
        pageSizeAction={setPageSize}
        pageNumberAction={setPageNumber}
        pageNumber={pageNumber}
      />
    </div>
  )
}
