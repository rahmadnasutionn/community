import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db';
import * as config from '@/config';
import PostFeed from './post-feed';

async function CustomFeed() {
  const session = await getAuthSession();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subreddit: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map(({ subreddit }) => subreddit.id)
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: config.INFINITE_SCROLL
  });
  return (
    <PostFeed initialPost={posts} />
  )
}

export default CustomFeed