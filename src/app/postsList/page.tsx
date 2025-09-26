'use client'

import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { GET_POSTS_LIST } from '@/lib/feature/postsList/api/getPostsList'
import { Input, Loader } from 'photo-flow-ui-kit'
import { PostResponse, PostsPaginationModel } from '@/lib/types/graphql'
import Post from '@/lib/feature/postsList/ui/post/Post'
import { useCallback, useEffect, useRef, useState } from 'react'
import { POST_ADDED } from '@/lib/feature/postsList/api/postAdded'

export default function PostsList() {
  const client = useApolloClient()
  const lastDivRef = useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = useState('')

  const { data, error, loading, fetchMore, refetch } = useQuery<{ getPosts: PostsPaginationModel }>(
    GET_POSTS_LIST,
    {
      variables: {
        pageSize: 8,
        endCursorPostId: 0,
        sortBy: 'createdAt',
        searchTerm: searchValue,
      },
    }
  )

  useSubscription(POST_ADDED, {
    onData: ({ data: subscriptionData }) => {
      const newPost = subscriptionData?.data?.postAdded
      if (!newPost) return
      client.cache.modify({
        fields: {
          getPosts(existingPosts = { items: [] }) {
            const newItems = existingPosts.items.filter(
              (post: PostResponse) => post.id !== newPost.id
            )
            return {
              ...existingPosts,
              items: [newPost, ...newItems],
            }
          },
        },
      })
    },
  })

  useEffect(() => {
    setTimeout(async () => await refetch(), 300)
  }, [searchValue, refetch])

  const handleMore = useCallback(async () => {
    const lastCursor = data?.getPosts.items[data.getPosts.items.length - 1].id || 0
    try {
      await fetchMore({
        variables: {
          endCursorPostId: lastCursor,
        },
      })
    } catch (e) {
      console.log(e)
    }
  }, [fetchMore, data])

  const handleIntersection = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]
      if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
        try {
          await handleMore()
        } catch (e) {
          console.log(e)
        }
      }
    },
    [handleMore]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.8,
    })
    if (lastDivRef.current) {
      observer.observe(lastDivRef.current)
    }
    return () => {
      observer.disconnect()
    }
  }, [handleIntersection])

  if (loading || error || !data) {
    return (
      <div className='text-center'>
        <Loader />
      </div>
    )
  }

  return (
    <div className='pt-[60px]'>
      <Input
        onChange={e => setSearchValue(e.target.value)}
        type='search'
        className='h-[36px] w-[972px]'
        placeholder='Search'
      />
      <div className='mt-[36px] flex w-full flex-wrap gap-[12px]'>
        {data?.getPosts?.items.map((post, index) => (
          <Post
            ref={index === data.getPosts.items.length - 1 ? lastDivRef : null}
            key={post.id}
            images={post.images}
            username={post.postOwner.userName}
            avatar={post.postOwner.avatars[0]?.url}
            description={post.description}
            created={post.createdAt}
            postId={post.id}
            userId={post.ownerId}
          />
        ))}
      </div>
    </div>
  )
}
