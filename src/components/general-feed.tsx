import { db } from '@/lib/db'
import * as config from '@/config';
import PostFeed from './post-feed';

async function GeneralFeed() {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: config.INFINITE_SCROLL,
  })
  return (
    <PostFeed initialPost={posts} />
  )
}

export default GeneralFeed