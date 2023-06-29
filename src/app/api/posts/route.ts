import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from 'zod';

export async function GET(request: Request) {
  const url = new URL(request.url);

  const session = await getAuthSession();

  let followedCommunitiesId: string[] = [];

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        subreddit: true,
      },
    })

    followedCommunitiesId = followedCommunities.map(
      ({ subreddit }) => subreddit.id
    )
  }

  try {
   const { limit, page, subredditName } = z.object({
    limit: z.string(),
    page: z.string(),
    subredditName: z.string().nullish().optional(),
   }).parse({
      subredditName: url.searchParams.get('subredditName'),
      limit: url.searchParams.get('limit'),
      page: url.searchParams.get('page'),
   });

   let whereClause = {};

   if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName
        }
      }
   } else if (session) {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommunitiesId
          },
        },
      }
   }

   const posts = await db.post.findMany({
    take: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit),
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      subreddit: true,
      votes: true,
      author: true,
      comments: true,
    },
    where: whereClause,
   });

   return new Response(JSON.stringify(posts));
  } catch (error) {
    if (error instanceof z.ZodError) {
        return new Response('Invalid data passed', { status: 422 });
    }
  
    return new Response('Something went wrong, Please try again later', { status: 500 });
  }
}