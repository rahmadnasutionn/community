"use client";

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react';
import { useInfiniteQuery } from '@tanstack/react-query';

import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { ExtendedPost } from '@/types/db';
import * as config from '@/config';
import axios from 'axios';
import Post from './post';
import { Loader2 } from 'lucide-react';

interface PostFeedProps {
  initialPost: ExtendedPost[];
  subredditName?: string;
}

function PostFeed({ initialPost, subredditName }: PostFeedProps) {

  const { data: session } = useSession();
  const ref = useRef<HTMLDivElement | null>(null);

  const entry = useIntersectionObserver(ref, {});

  const { data, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    ['infinite-query'],
    async ({ pageParam = 1 }) => {
      const query = `/api/posts?limit=${config.INFINITE_SCROLL}&page=${pageParam}`
      + (!!subredditName ? `&subredditName=${subredditName}` : '')

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    }, {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPost], pageParams: [1] }
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPost;
  return (
    <ul className='flex flex-col col-span-2 space-y-6'>
      {posts.map((post, index) => {
        const votes = post.votes.reduce((acc, curr) => {
          if (curr.type === 'UP') return acc + 1;
          if (curr.type === 'DOWN') return acc - 1;
          return acc;
        }, 0)

        const currentVote = 
          post.votes.find(vote => vote.userId === session?.user.id);

        if (index === posts.length - 1) {
          return <div key={post.id} ref={ref}>
            <Post 
              post={post}
              currentVote={currentVote}
              votesAmt={votes}
              commentAmt={post.comments.length} 
              subredditName={post.subreddit.name} 
            />
          </div>
        } else {
          return <Post 
            post={post}
            currentVote={currentVote}
            votesAmt={votes}
            commentAmt={post.comments.length} 
            subredditName={post.subreddit.name} 
          />
        }
      })}

      {isFetchingNextPage ? (
        <li className="flex justify-center">
          <Loader2 className='w-6 h-6 animate-spin text-zinc-500' />
        </li>
      ) : undefined}
    </ul>
  );
};

export default PostFeed;