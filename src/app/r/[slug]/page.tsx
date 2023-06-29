import MiniCreatePost from '@/components/mini-create-post';
import PostFeed from '@/components/post-feed';
import * as config from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react'

async function page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        take: config.INFINITE_SCROLL,
      }
    }
  });

  if (!subreddit) return notFound();
  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl h-14'>
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      <PostFeed initialPost={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
};

export default page;